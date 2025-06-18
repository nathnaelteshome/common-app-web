import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | CommonApply",
  description:
    "Terms of Service for CommonApply - Read our terms and conditions for using our university application platform.",
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using CommonApply ("the Service"), you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                CommonApply is an online platform that facilitates university applications by connecting students with
                educational institutions. We provide tools and services to streamline the application process,
                including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>University search and comparison tools</li>
                <li>Application management system</li>
                <li>Document upload and management</li>
                <li>Communication tools between students and universities</li>
                <li>Payment processing for application fees</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Account Creation</h3>
              <p className="text-gray-700 mb-4">
                To use our services, you must create an account and provide accurate, complete, and current information.
                You are responsible for maintaining the confidentiality of your account credentials.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">3.2 Account Types</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>
                  <strong>Student Accounts:</strong> For individuals applying to universities
                </li>
                <li>
                  <strong>University Accounts:</strong> For educational institutions managing applications
                </li>
                <li>
                  <strong>Administrator Accounts:</strong> For platform management and oversight
                </li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">3.3 Account Responsibilities</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Maintain accurate and up-to-date information</li>
                <li>Protect your login credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Conduct</h2>
              <p className="text-gray-700 mb-4">You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Provide false or misleading information</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful or malicious content</li>
                <li>Interfere with the platform's operation</li>
                <li>Access other users' accounts without permission</li>
                <li>Use automated systems to access the service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Application Process</h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">5.1 Application Submission</h3>
              <p className="text-gray-700 mb-4">
                Students are responsible for ensuring all application information is accurate and complete. CommonApply
                serves as a facilitator and is not responsible for application decisions made by universities.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">5.2 Application Fees</h3>
              <p className="text-gray-700 mb-4">
                Application fees are set by individual universities. CommonApply may charge service fees for platform
                usage. All fees are non-refundable unless otherwise specified.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">5.3 Document Verification</h3>
              <p className="text-gray-700 mb-4">
                Users are responsible for the authenticity of all submitted documents. CommonApply reserves the right to
                verify documents and may suspend accounts for fraudulent submissions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Payment Terms</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>All payments must be made through approved payment methods</li>
                <li>Fees are charged in the currency specified at the time of payment</li>
                <li>Refunds are subject to our refund policy</li>
                <li>Users are responsible for any applicable taxes</li>
                <li>Payment information is processed securely through third-party providers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The Service and its original content, features, and functionality are owned by CommonApply and are
                protected by international copyright, trademark, patent, trade secret, and other intellectual property
                laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Privacy</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
                Service, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimers</h2>
              <p className="text-gray-700 mb-4">
                The Service is provided "as is" without warranties of any kind. CommonApply does not guarantee:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Acceptance to any university or program</li>
                <li>Uninterrupted or error-free service</li>
                <li>The accuracy of university information</li>
                <li>The security of data transmission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                CommonApply shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice,
                for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any material changes.
                Your continued use of the Service after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of Ethiopia, without regard
                to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> legal@commonapply.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Address:</strong> CommonApply Legal Department
                </p>
                <p className="text-gray-700 mb-2">123 Education Street</p>
                <p className="text-gray-700">Addis Ababa, Ethiopia</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
