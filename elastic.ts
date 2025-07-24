import { Client } from '@elastic/elasticsearch';
import { Email } from '../types/email';

const esClient = new Client({ node: 'http://localhost:9200' });
const indexName = 'emails';

export async function indexEmail(email: Email) {
  await esClient.index({ index: indexName, body: email });
}

export async function searchEmails(query: string, filters: { account?: string; folder?: string }) {
  const must: any[] = [];
  if (query) must.push({ multi_match: { query, fields: ['subject', 'from', 'text'] } });
  if (filters.account) must.push({ match: { account: filters.account } });
  if (filters.folder) must.push({ match: { folder: filters.folder } });

  const result = await esClient.search({ index: indexName, size: 50, query: { bool: { must } } });
  return result.hits.hits.map(hit => hit._source);
}

export async function getFilters() {
  const res = await esClient.search({
    index: indexName,
    size: 0,
    aggs: {
      accounts: { terms: { field: 'account.keyword', size: 10 } },
      folders: { terms: { field: 'folder.keyword', size: 10 } },
    },
  });

  const aggregations = res.aggregations as {
    accounts: { buckets: { key: string }[] };
    folders: { buckets: { key: string }[] };
  };

  const accounts = aggregations.accounts.buckets.map(b => b.key);
  const folders = aggregations.folders.buckets.map(b => b.key);
  return { accounts, folders };
}
