import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary">Privacy Policy</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-700">
            Welcome to Pamoja. We are committed to protecting your personal
            information and your right to privacy. This Privacy Policy explains
            how we collect, use, and safeguard your information when you use our
            services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            2. Information We Collect
          </h2>
          <p className="text-gray-700 mb-4">
            We collect information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Create an account</li>
            <li>Use our chat services</li>
            <li>Contact us through WhatsApp</li>
            <li>Participate in community discussions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            3. How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Provide and maintain our services</li>
            <li>Improve and personalize your experience</li>
            <li>Respond to your questions and concerns</li>
            <li>Send you updates and important information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            4. Information Security
          </h2>
          <p className="text-gray-700">
            We implement appropriate technical and organizational security
            measures to protect your personal information. All conversations are
            encrypted, and we follow industry best practices for data security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            5. WhatsApp Integration
          </h2>
          <p className="text-gray-700">
            When you use our WhatsApp service, your interactions are subject to
            both our Privacy Policy and WhatsApp's Privacy Policy. Messages sent
            through WhatsApp are end-to-end encrypted.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p className="text-gray-700">
            If you have questions about this Privacy Policy or our practices,
            please contact us at support@pamoja.com
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            8. Updates to This Policy
          </h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>

        <footer className="mt-8 pt-4 border-t text-gray-600 text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
