"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const courses = [
    {
      id: "python-basics",
      name: "Python Programming Basics",
      duration: "6 Months",
      price: 15000,
      features: [
        "Live Interactive Classes",
        "24/7 Doubt Support",
        "Real Projects",
        "Certificate on Completion",
      ],
    },
    {
      id: "web-development",
      name: "Full Stack Web Development",
      duration: "6 Months",
      price: 18000,
      features: [
        "HTML, CSS, JavaScript",
        "React & Next.js",
        "Backend Development",
        "Live Projects",
      ],
    },
    {
      id: "ai-ml",
      name: "AI & Machine Learning",
      duration: "6 Months",
      price: 20000,
      features: [
        "Python for AI",
        "Machine Learning Basics",
        "Neural Networks",
        "Real-world Projects",
      ],
    },
    {
      id: "game-development",
      name: "Game Development with Unity",
      duration: "6 Months",
      price: 17000,
      features: [
        "Unity Basics",
        "C# Programming",
        "2D & 3D Games",
        "Game Publishing",
      ],
    },
  ];

  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const courseId = searchParams.get("course");
    if (courseId) {
      const course = courses.find((c) => c.id === courseId);
      setSelectedCourse(course);
    }
  }, [searchParams]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      alert("Please select a course");
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill all fields");
      return;
    }

    setIsProcessing(true);

    try {
      // Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setIsProcessing(false);
        return;
      }

      // Create order
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedCourse.price,
          courseId: selectedCourse.id,
          courseName: selectedCourse.name,
          studentEmail: formData.email,
          studentName: formData.name,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        alert("Failed to create order. Please try again.");
        setIsProcessing(false);
        return;
      }

      // Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "LumiSkill",
        description: selectedCourse.name,
        order_id: orderData.orderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#6C3EE8",
        },
        handler: async function (response) {
          // Verify payment
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: selectedCourse.id,
              courseName: selectedCourse.name,
              studentEmail: formData.email,
              studentName: formData.name,
              amount: orderData.amount,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            router.push(`/payment/success?paymentId=${verifyData.paymentId}`);
          } else {
            router.push("/payment/failure");
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Complete Your Purchase</h1>
        <p className={styles.subtitle}>
          Join thousands of students learning to code
        </p>

        <div className={styles.content}>
          {/* Course Selection */}
          <div className={styles.courseSection}>
            <h2 className={styles.sectionTitle}>Select Course</h2>
            <div className={styles.courseGrid}>
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`${styles.courseCard} ${
                    selectedCourse?.id === course.id ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedCourse(course)}
                >
                  <h3 className={styles.courseName}>{course.name}</h3>
                  <p className={styles.courseDuration}>{course.duration}</p>
                  <p className={styles.coursePrice}>₹{course.price.toLocaleString()}</p>
                  <ul className={styles.featuresList}>
                    {course.features.map((feature, index) => (
                      <li key={index}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Student Details Form */}
          {selectedCourse && (
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Student Details</h2>
              <form onSubmit={handlePayment} className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={styles.input}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={styles.input}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={styles.input}
                    placeholder="10-digit mobile number"
                  />
                </div>

                {/* Order Summary */}
                <div className={styles.summary}>
                  <h3 className={styles.summaryTitle}>Order Summary</h3>
                  <div className={styles.summaryRow}>
                    <span>Course:</span>
                    <span>{selectedCourse.name}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Duration:</span>
                    <span>{selectedCourse.duration}</span>
                  </div>
                  <div className={`${styles.summaryRow} ${styles.total}`}>
                    <span>Total Amount:</span>
                    <span>₹{selectedCourse.price.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className={styles.payBtn}
                >
                  {isProcessing ? "Processing..." : "Proceed to Payment"}
                </button>

                <p className={styles.secureText}>
                  🔒 Secure payment powered by Razorpay
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
