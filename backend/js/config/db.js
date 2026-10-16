const mongoose = require('mongoose');
const dns = require('node:dns');
const { promisify } = require('node:util');

const DEFAULT_DNS_SERVERS = ['1.1.1.1', '8.8.8.8'];
const resolveSrvWith = promisify(dns.Resolver.prototype.resolveSrv);
const resolveTxtWith = promisify(dns.Resolver.prototype.resolveTxt);

function isPlaceholder(value) {
    return /<[^>]+>|your[_ -]?(username|password)|change.?me|example/i.test(value);
}

function configuredDnsServers() {
    const servers = (process.env.MONGODB_DNS_SERVERS || DEFAULT_DNS_SERVERS.join(','))
        .split(',')
        .map(server => server.trim())
        .filter(Boolean);
    if (servers.length === 0) {
        throw new Error('MONGODB_DNS_SERVERS must contain at least one DNS server address.');
    }
    return servers;
}

async function resolveAtlasSeedUri(uri) {
    const atlasUri = new URL(uri);
    if (atlasUri.protocol !== 'mongodb+srv:') {
        throw new Error('Atlas SRV fallback requires a mongodb+srv connection URI.');
    }

    const resolver = new dns.Resolver();
    resolver.setServers(configuredDnsServers());
    const srvName = `_mongodb._tcp.${atlasUri.hostname}`;
    const [srvRecords, txtRecords] = await Promise.all([
        resolveSrvWith.call(resolver, srvName),
        resolveTxtWith.call(resolver, atlasUri.hostname)
    ]);

    if (srvRecords.length === 0) {
        throw new Error('MongoDB Atlas did not return any seed hosts for this cluster.');
    }

    const atlasDomain = atlasUri.hostname.split('.').slice(1).join('.');
    if (srvRecords.some(record => !record.name.endsWith(`.${atlasDomain}`))) {
        throw new Error('MongoDB Atlas returned an unexpected seed hostname.');
    }

    const query = new URLSearchParams(atlasUri.search);
    const txtOptions = new URLSearchParams(txtRecords.flat().join(''));
    for (const option of ['authSource', 'replicaSet']) {
        if (!query.has(option) && txtOptions.has(option)) {
            query.set(option, txtOptions.get(option));
        }
    }
    if (!query.has('tls')) {
        query.set('tls', 'true');
    }

    const credentials = atlasUri.username
        ? `${atlasUri.username}${atlasUri.password ? `:${atlasUri.password}` : ''}@`
        : '';
    const seeds = srvRecords.map(record => `${record.name}:${record.port}`).join(',');
    return `mongodb://${credentials}${seeds}${atlasUri.pathname || '/'}?${query.toString()}`;
}

async function connectDB() {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error('Set MONGODB_URI or MONGO_URI to connect to MongoDB.');
    }

    let parsedUri;
    try {
        parsedUri = new URL(mongoUri);
    } catch {
        throw new Error('MongoDB URI is invalid. Copy the connection string from Atlas.');
    }
    if (isPlaceholder(decodeURIComponent(parsedUri.username))
        || isPlaceholder(decodeURIComponent(parsedUri.password))) {
        throw new Error('MongoDB URI still contains a placeholder credential. Replace it with the MongoDB database user credentials from Atlas.');
    }

    const databaseName = process.env.MONGODB_DB_NAME
        || process.env.MONGO_DB_NAME
        || decodeURIComponent(parsedUri.pathname.replace(/^\/+/, '').split('/')[0])
        || 'nestsphere';
    try {
        await mongoose.connect(mongoUri, { dbName: databaseName });
    } catch (error) {
        if (parsedUri.protocol !== 'mongodb+srv:' || error.code !== 'ECONNREFUSED'
            || !String(error.message).includes('querySrv')) {
            throw error;
        }
        console.warn('System DNS refused the Atlas SRV lookup; retrying with configured fallback DNS servers.');
        const seedUri = await resolveAtlasSeedUri(mongoUri);
        await mongoose.connect(seedUri, { dbName: databaseName });
    }

    console.log('MongoDB connected');
    return mongoose.connection;
}

module.exports = connectDB;
module.exports.resolveAtlasSeedUri = resolveAtlasSeedUri;
