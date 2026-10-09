export async function onRequest(context) {
  const { request, env } = context;
  const ns = env.VISITOR_KV;
  if (!ns) {
    return Response.json({ error: 'VISITOR_KV not bound' }, { status: 500 });
  }
  let count = await ns.get('total');
  count = count ? parseInt(count, 10) : 0;
  if (request.method === 'POST') {
    count += 1;
    await ns.put('total', String(count));
  }
  return Response.json({ count });
}
