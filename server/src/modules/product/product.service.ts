export async function getProducts() {
  return {
    select: {
      id: true,
      title: true,
      price: true,
      createdAt: true,
      updatedAt: true,
      content: true,
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  };
}
