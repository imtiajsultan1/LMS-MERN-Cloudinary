import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchInvoiceService } from "@/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

function StudentInvoicePage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  function formatDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-GB");
  }

  async function loadInvoice() {
    try {
      const response = await fetchInvoiceService(orderId);
      if (response?.success) {
        setInvoice(response?.data);
      } else {
        toast({
          variant: "destructive",
          title: "Invoice not found",
          description: response?.message || "Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Invoice not found",
        description:
          error?.response?.data?.message || "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (orderId) loadInvoice();
  }, [orderId]);

  if (loading) {
    return (
      <Card className="max-w-3xl mx-auto mt-10">
        <CardHeader>
          <CardTitle>Loading invoice...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!invoice) {
    return (
      <Card className="max-w-3xl mx-auto mt-10">
        <CardHeader>
          <CardTitle>Invoice not available</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate("/student-courses")}>
            Back to My Courses
          </Button>
        </CardContent>
      </Card>
    );
  }

  const billing = invoice.billingDetails || {};

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Invoice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Invoice Number</p>
              <p className="text-lg font-semibold">
                {invoice.invoiceNumber || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Invoice Date</p>
              <p className="text-lg font-semibold">
                {formatDate(invoice.orderDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-lg font-semibold capitalize">
                {invoice.orderStatus}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-base font-semibold mb-2">Billed To</h3>
            <p className="text-sm">{billing.name || invoice.userName}</p>
            <p className="text-sm text-gray-600">
              {billing.email || invoice.userEmail}
            </p>
            <p className="text-sm text-gray-600">
              {billing.address || "-"}
            </p>
            <p className="text-sm text-gray-600">
              {billing.city || "-"} {billing.postalCode || ""}
            </p>
            <p className="text-sm text-gray-600">
              {billing.country || "-"}
            </p>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-base font-semibold mb-2">Course</h3>
            <div className="flex items-center justify-between">
              <p className="text-sm">{invoice.courseTitle}</p>
              <p className="text-sm font-semibold">
                Tk {invoice.coursePricing}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold">Total</p>
              <p className="text-base font-semibold">
                Tk {invoice.coursePricing}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Payment method: {invoice.paymentMethod}{" "}
              {invoice.cardLast4 ? `(**** ${invoice.cardLast4})` : ""}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => window.print()}>Print Invoice</Button>
            <Button
              variant="outline"
              onClick={() => navigate("/student-courses")}
            >
              Back to My Courses
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StudentInvoicePage;
