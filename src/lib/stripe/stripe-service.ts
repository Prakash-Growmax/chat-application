import {
  getSubscriptionByUserId,
  updateSessionIdInSubscription,
} from "../subscriptions/subscriptions-service";

export const createSubscriptionCheckoutSession = (
  price: Number,
  userId: string
) => {
  try {
    fetch("http://localhost:8080/api/v1/create-subscription-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({ plan: price, customerId: userId }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(async ({ session }) => {
        const subscription = await getSubscriptionByUserId(userId);

        if (!session.id || !session.id) return null;

        await updateSessionIdInSubscription(subscription?.id, session?.id);
        window.location = session.url;
      })
      .catch((e) => {});
  } catch (error) {
    console.error(error);
  }
};
