import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy | CommonApply",
  description: "Cookie Policy for CommonApply - Learn about how we use cookies and similar technologies.",
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies?</h2>
              <p className="text-gray-700 mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website.
                They are widely used to make websites work more efficiently and to provide information to website
                owners.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Cookies</h2>
              <p className="text-gray-700 mb-4">
                CommonApply uses cookies to enhance your experience on our platform. We use cookies for various purposes
                including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Keeping you signed in to your account</li>
                <li>Remembering your preferences and settings</li>
                <li>Analyzing how you use our website</li>
                <li>Improving our services and user experience</li>
                <li>Providing personalized content and recommendations</li>
                <li>Ensuring the security of our platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Types of Cookies We Use</h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Essential Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality such as
                security, network management, and accessibility.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Examples:</strong> Session cookies, authentication cookies, load balancing cookies
                </p>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">3.2 Performance Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies collect information about how visitors use our website, such as which pages are visited
                most often and if users get error messages.
              </p>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-green-800">
                  <strong>Examples:</strong> Google Analytics, page load time tracking, error reporting
                </p>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">3.3 Functionality Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies allow the website to remember choices you make and provide enhanced, more personal
                features.
              </p>
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-purple-800">
                  <strong>Examples:</strong> Language preferences, theme settings, form data retention
                </p>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">3.4 Targeting/Advertising Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies are used to deliver advertisements more relevant to you and your interests.
              </p>
              <div className="bg-orange-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-orange-800">
                  <strong>Examples:</strong> Social media cookies, advertising network cookies, remarketing pixels
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Cookies</h2>
              <p className="text-gray-700 mb-4">
                We may also use third-party services that set cookies on your device. These include:
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purpose
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Privacy Policy
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Google Analytics
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Website analytics and performance tracking
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                          View Policy
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Stripe</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Payment processing and fraud prevention
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
                          View Policy
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Intercom</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Customer support and messaging
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        <a href="https://www.intercom.com/legal/privacy" target="_blank" rel="noopener noreferrer">
                          View Policy
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookie Duration</h2>
              <p className="text-gray-700 mb-4">Cookies can be either session cookies or persistent cookies:</p>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Session Cookies</h4>
                  <p className="text-sm text-gray-700">
                    These are temporary cookies that are deleted when you close your browser. They help us track your
                    activity during a single browsing session.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Persistent Cookies</h4>
                  <p className="text-sm text-gray-700">
                    These cookies remain on your device for a set period or until you delete them. They help us remember
                    your preferences across multiple visits.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Managing Your Cookie Preferences</h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">6.1 Browser Settings</h3>
              <p className="text-gray-700 mb-4">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>View what cookies are stored on your device</li>
                <li>Delete cookies individually or all at once</li>
                <li>Block cookies from specific websites</li>
                <li>Block all cookies</li>
                <li>Set your browser to notify you when cookies are being set</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">6.2 Cookie Consent Manager</h3>
              <p className="text-gray-700 mb-4">
                We provide a cookie consent manager that allows you to control which types of cookies you accept. You
                can access this at any time through the cookie settings link in our website footer.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Disabling certain cookies may affect the functionality of our website and your
                  user experience.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Browser-Specific Instructions</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Chrome</h4>
                  <p className="text-sm text-gray-700">Settings → Privacy and Security → Cookies and other site data</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Firefox</h4>
                  <p className="text-sm text-gray-700">Options → Privacy & Security → Cookies and Site Data</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Safari</h4>
                  <p className="text-sm text-gray-700">Preferences → Privacy → Manage Website Data</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Edge</h4>
                  <p className="text-sm text-gray-700">
                    Settings → Cookies and site permissions → Cookies and site data
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Mobile Devices</h2>
              <p className="text-gray-700 mb-4">
                For mobile devices, you can manage cookies through your browser settings or by adjusting your device's
                privacy settings. Some mobile operating systems also provide options to limit ad tracking.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Updates to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other
                operational, legal, or regulatory reasons. We will notify you of any material changes by posting the
                updated policy on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> privacy@commonapply.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Subject:</strong> Cookie Policy Inquiry
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Address:</strong> CommonApply Privacy Office
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
