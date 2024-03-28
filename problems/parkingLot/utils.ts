export async function wait(duration: number): Promise<unknown> {
  return await new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
