import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CheckoutClient from "./components/CheckoutClient";
import { getUser } from "./actions/getUser";
import { mergeCartOnCheckout } from "./actions/mergeCartOnCheckout";
import { getAddresses } from "./actions/getAddresses";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login?redirect=/checkout");
  }

  const [user, cart, addresses] = await Promise.all([
    getUser(session.user.id),
    mergeCartOnCheckout(),
    getAddresses(session.user.id)
  ]);

  if (!cart || !cart.items || cart.items.length === 0) {
    redirect("/cart?message=empty");
  }

  if (!user) return null;
  return <CheckoutClient user={user} cart={{
    ...cart, items: (cart.items ?? []).map(item => ({
      ...item,
      id: item.id,
      product: item.product ? { id: item.product.id, name: item.product.name, price: item.product.price } : null
    }))
  }} addresses={addresses} />;
}
