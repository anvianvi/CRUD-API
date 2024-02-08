export default function isValidUUID(uuid: string | undefined): boolean {
  const reg =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof uuid === 'string' && reg.test(uuid);
}
