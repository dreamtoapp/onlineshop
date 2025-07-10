import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CheckoutClient from "./components/CheckoutClient";
import { getUser } from "./actions/getUser";
import { getCart } from "./actions/getCart";
import { getAddresses } from "./actions/getAddresses";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login?redirect=/checkout");
  }

  const [user, cart, addresses] = await Promise.all([
    getUser(session.user.id),
    getCart(session.user.id),
    getAddresses(session.user.id)
  ]);

  if (!cart || !cart.items || cart.items.length === 0) {
    redirect("/cart?message=empty");
  }

  if (!user) return null;
  return <CheckoutClient user={user} cart={cart} addresses={addresses} />;
}
