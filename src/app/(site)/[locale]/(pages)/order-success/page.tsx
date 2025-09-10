"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { getOrderById, type Order } from "@/services/apiOrders";
import {
  createNotificationData,
  convertOrderToOrderDetails,
  sendWhatsAppNotificationDirect,
} from "@/utils/whatsappNotification";

const OrderSuccessPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const locale = useLocale();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSendWhatsApp = () => {
    if (!order) return;

    try {
      // Convert order to order details format
      const orderDetails = convertOrderToOrderDetails(
        order,
        order.order_items || []
      );
      sendWhatsAppNotificationDirect(orderDetails);
    } catch (error) {
      console.error("Error sending WhatsApp notification:", error);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order ID not found");
        setLoading(false);
        return;
      }

      try {
        const { order: fetchedOrder, error: fetchError } = await getOrderById(
          orderId
        );

        if (fetchError) {
          setError(fetchError);
        } else {
          setOrder(fetchedOrder);
        }
      } catch (err) {
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <>
        <Breadcrumb
          title={locale === "ar" ? "تم الطلب بنجاح" : "Order Success"}
          pages={[locale === "ar" ? "تم الطلب بنجاح" : "Order Success"]}
        />
        <section className="py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="bg-white shadow-1 rounded-[10px] p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto"></div>
              <p className="mt-4 text-dark-5">Loading order details...</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Breadcrumb
          title={locale === "ar" ? "خطأ في الطلب" : "Order Error"}
          pages={[locale === "ar" ? "خطأ في الطلب" : "Order Error"]}
        />
        <section className="py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="bg-white shadow-1 rounded-[10px] p-8 text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-semibold text-dark mb-4">
                {locale === "ar" ? "حدث خطأ" : "Something went wrong"}
              </h2>
              <p className="text-dark-5 mb-6">{error}</p>
              <Link
                href="/"
                className="inline-block bg-blue text-white px-6 py-3 rounded-md hover:bg-blue-dark transition-colors"
              >
                {locale === "ar" ? "العودة للرئيسية" : "Return Home"}
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb
        title={locale === "ar" ? "تم الطلب بنجاح" : "Order Success"}
        pages={[locale === "ar" ? "تم الطلب بنجاح" : "Order Success"]}
      />
      <section className="py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white shadow-1 rounded-[10px] p-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h1 className="text-3xl font-bold text-dark mb-2">
                {locale === "ar"
                  ? "تم إرسال طلبك بنجاح!"
                  : "Order Placed Successfully!"}
              </h1>
              <p className="text-dark-5">
                {locale === "ar"
                  ? "شكراً لك على طلبك. سنقوم بمعالجته في أقرب وقت ممكن."
                  : "Thank you for your order. We'll process it as soon as possible."}
              </p>
            </div>

            {/* Order Details */}
            <div className="border-t border-gray-3 pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Info */}
                <div>
                  <h3 className="text-xl font-semibold text-dark mb-4">
                    {locale === "ar" ? "تفاصيل الطلب" : "Order Details"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-dark-5">
                        {locale === "ar" ? "رقم الطلب:" : "Order ID:"}
                      </span>
                      <span className="font-medium text-dark">#{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-5">
                        {locale === "ar" ? "تاريخ الطلب:" : "Order Date:"}
                      </span>
                      <span className="font-medium text-dark">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-5">
                        {locale === "ar" ? "حالة الطلب:" : "Status:"}
                      </span>
                      <span className="font-medium text-green-600 capitalize">
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-5">
                        {locale === "ar" ? "المجموع:" : "Total:"}
                      </span>
                      <span className="font-bold text-dark text-lg">
                        ${order.total_price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                {(order.customer_first_name || order.customer_last_name) && (
                  <div>
                    <h3 className="text-xl font-semibold text-dark mb-4">
                      {locale === "ar"
                        ? "معلومات العميل"
                        : "Customer Information"}
                    </h3>
                    <div className="space-y-3">
                      {(order.customer_first_name ||
                        order.customer_last_name) && (
                        <div>
                          <span className="text-dark-5 block">
                            {locale === "ar" ? "الاسم:" : "Name:"}
                          </span>
                          <span className="font-medium text-dark">
                            {order.customer_first_name}{" "}
                            {order.customer_last_name}
                          </span>
                        </div>
                      )}
                      {order.customer_phone && (
                        <div>
                          <span className="text-dark-5 block">
                            {locale === "ar" ? "رقم الهاتف:" : "Phone:"}
                          </span>
                          <span className="font-medium text-dark">
                            {order.customer_phone}
                          </span>
                        </div>
                      )}
                      {order.customer_email && (
                        <div>
                          <span className="text-dark-5 block">
                            {locale === "ar" ? "البريد الإلكتروني:" : "Email:"}
                          </span>
                          <span className="font-medium text-dark">
                            {order.customer_email}
                          </span>
                        </div>
                      )}
                      {order.customer_street_address && (
                        <div>
                          <span className="text-dark-5 block">
                            {locale === "ar"
                              ? "عنوان التسليم:"
                              : "Delivery Address:"}
                          </span>
                          <span className="font-medium text-dark">
                            {order.customer_street_address}
                            <br />
                            {order.customer_city}, {order.customer_state}{" "}
                            {order.customer_postcode}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              {order.order_items && order.order_items.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-3">
                  <h3 className="text-xl font-semibold text-dark mb-4">
                    {locale === "ar" ? "المنتجات المطلوبة" : "Order Items"}
                  </h3>
                  <div className="space-y-4">
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-3 border-b border-gray-3"
                      >
                        <div>
                          <h4 className="font-medium text-dark">
                            {item.products?.title ||
                              `Product ${item.product_id}`}
                          </h4>
                          <p className="text-sm text-dark-5">
                            {locale === "ar" ? "الكمية:" : "Quantity:"}{" "}
                            {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-dark">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="mt-8 pt-8  border-gray-3 text-center">
                <h3 className="text-xl font-semibold text-dark mb-4">
                  {locale === "ar" ? "ماذا بعد؟" : "What's Next?"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-4 bg-gray-1 rounded-lg">
                    <div className="text-blue text-2xl mb-2">📞</div>
                    <h4 className="font-medium text-dark mb-2">
                      {locale === "ar" ? "سنتواصل معك" : "We'll Contact You"}
                    </h4>
                    <p className="text-sm text-dark-5">
                      {locale === "ar"
                        ? "سنقوم بالاتصال بك لتأكيد الطلب وترتيب التسليم"
                        : "We'll call you to confirm your order and arrange delivery"}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-1 rounded-lg">
                    <div className="text-blue text-2xl mb-2">🚚</div>
                    <h4 className="font-medium text-dark mb-2">
                      {locale === "ar" ? "التسليم السريع" : "Fast Delivery"}
                    </h4>
                    <p className="text-sm text-dark-5">
                      {locale === "ar"
                        ? "سيتم توصيل طلبك في أقرب وقت ممكن"
                        : "Your order will be delivered as soon as possible"}
                    </p>
                  </div>
                </div>

                <div className="space-x-4">
                  <Link
                    href="/"
                    className="ml-4 inline-block bg-blue text-white px-6 py-3 rounded-md hover:bg-blue-dark transition-colors"
                  >
                    {locale === "ar" ? "متابعة التسوق" : "Continue Shopping"}
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-block border border-blue text-blue px-6 py-3 rounded-md hover:bg-blue hover:text-white transition-colors"
                  >
                    {locale === "ar" ? "اتصل بنا" : "Contact Us"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderSuccessPage;
