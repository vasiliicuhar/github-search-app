export async function fetcher<Data>(url: string): Promise<Data> {
  const res = await fetch(url);

  if (!res.ok) {
    throw res;
  }

  return res.json();
}
