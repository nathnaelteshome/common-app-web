import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | CommonApply",
  description: "Learn how CommonApply collects, uses, and protects your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
              <p className="text-gray-600 text-lg">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Welcome to CommonApply ("we," "our," or "us"). We are committed to protecting your privacy and
                  ensuring the security of your personal information. This Privacy Policy explains how we collect, use,
                  disclose, and safeguard your information when you use our university application platform.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using CommonApply, you agree to the collection and use of information in accordance with this
                  policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Personal Information</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Name, email address, phone number</li>
                  <li>Educational background and academic records</li>
                  <li>Identity documents and verification materials</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Application essays and supporting documents</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">Usage Information</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                  <li>Pages visited and time spent on our platform</li>
                  <li>Search queries and application preferences</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Process and manage your university applications</li>
                  <li>Verify your identity and academic credentials</li>
                  <li>Communicate with you about your applications and our services</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Improve our platform and develop new features</li>
                  <li>Send important updates and notifications</li>
                  <li>Comply with legal obligations and prevent fraud</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    <strong>Universities:</strong> We share application data with universities you apply to
                  </li>
                  <li>
                    <strong>Service Providers:</strong> Third-party vendors who assist with our operations
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law or to protect our rights
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with mergers or acquisitions
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  We do not sell your personal information to third parties for marketing purposes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Employee training on data protection</li>
                  <li>Incident response procedures</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    <strong>Access:</strong> Request copies of your personal data
                  </li>
                  <li>
                    <strong>Rectification:</strong> Request correction of inaccurate information
                  </li>
                  <li>
                    <strong>Erasure:</strong> Request deletion of your personal data
                  </li>
                  <li>
                    <strong>Portability:</strong> Request transfer of your data
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to processing of your data
                  </li>
                  <li>
                    <strong>Restriction:</strong> Request limitation of processing
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this
                  policy, comply with legal obligations, resolve disputes, and enforce our agreements. Application data
                  is typically retained for 7 years after the completion of the application process.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. International Transfers</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure
                  appropriate safeguards are in place to protect your data in accordance with applicable data protection
                  laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our services are not intended for children under 16. We do not knowingly collect personal information
                  from children under 16. If we become aware that we have collected such information, we will take steps
                  to delete it promptly.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                  new policy on this page and updating the "Last updated" date. We encourage you to review this policy
                  periodically.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> privacy@commonapply.com
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Phone:</strong> (+251) 911-221-122
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> Addis Ababa, Ethiopia
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
