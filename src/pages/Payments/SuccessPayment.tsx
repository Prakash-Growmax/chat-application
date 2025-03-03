import { env_NODE_URL } from "@/constants/env.constant";
import { updateSubscription } from "@/lib/subscription";
import { getSubscriptionByUserId } from "@/lib/subscriptions/subscriptions-service";
import { supabase } from "@/lib/supabase";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SuccessPayment() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [subscription, setSubscription] = useState({ stripe_session_id: "" });

  const fetchUserSubscription = async (userId: string) => {
    const subscription = await getSubscriptionByUserId(userId);

    if (!subscription) return null;
    setSubscription(subscription);
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_, session: any) => {
      if (session) {
        setUserId(session?.user?.id);
        fetchUserSubscription(session.user.id);
      } else {
        setUserId("");
      }
    });

    return () => {
      data.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userId && subscription?.stripe_session_id) handlePaymentSuccess();
  }, [userId, subscription]);

  const handlePaymentSuccess = async () => {
    if (!subscription?.stripe_session_id) return null;
    fetch(`${env_NODE_URL}payment-success`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: subscription.stripe_session_id,
        userId,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(async (data) => {
        if (data && data.subscription) {
          const planId: string = data.subscription.plan.id;
          const planType: string =
            data.subscription.plan.amount === 1000 ? "pro" : "free";
          const startDate: string = moment
            .unix(data.subscription.current_period_start)
            .format("YYYY-MM-DD");
          const endDate: string = moment
            .unix(data.subscription.current_period_end)
            .format("YYYY-MM-DD");
          const durationInSeconds: number =
            data.subscription.current_period_end -
            data.subscription.current_period_start;
          const durationInDays: number = moment
            .duration(durationInSeconds, "seconds")
            .asDays();

          const { data: updatedSubscription, error } = await supabase
            .from("subscriptions")
            .update({
              strip_plan_id: planId,
              status: "active",
              current_period_start: startDate,
              current_period_end: endDate,
              cancel_at_period_end: false,
              stripe_session_id: subscription?.stripe_session_id,
              plan_type: planType,
              plan_start_date: startDate,
              plan_end_date: endDate,
              plan_duration: durationInDays,
            })
            .eq("user_id", userId);

          if (error) throw new Error("Error while updating Subscriptions");
          updateSubscription(
            data.subscription.plan.amount === 1000 ? "Pro Plan" : "Free Plan"
          );
          navigate("/chat/new");
        }
        //
      })
      .catch(() => {
        
      });
  };

  return (
    <div className="mt-32">
      <h1>User ID: {userId}</h1>
      {/* <h2>Subscription Session ID: {sessionId}</h2> */}
    </div>
  );
}

export default SuccessPayment;
