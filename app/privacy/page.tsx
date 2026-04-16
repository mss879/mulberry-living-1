import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Mulberry Living in Negombo, Sri Lanka.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-20 section-padding min-h-[70vh]">
      <div className="container-narrow max-w-3xl space-y-8">
        <h1 className="heading-display">Privacy Policy</h1>
        <div className="space-y-6 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-serif text-foreground font-medium">1. Introduction</h2>
          <p>
            Welcome to Mulberry Living. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you as to how we look after your personal data when you visit our website 
            and tell you about your privacy rights.
          </p>
          
          <h2 className="text-xl font-serif text-foreground font-medium">2. The Data We Collect</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you when you make a booking, 
            submit an enquiry, or interact with our website. This may include: Identity Data (first name, last name), 
            Contact Data (email address, telephone numbers), and Booking Data.
          </p>
          
          <h2 className="text-xl font-serif text-foreground font-medium">3. How We Use Your Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal 
            data to process and manage your booking, communicate with you regarding your stay, and to reply to 
            enquiries you submit through our contact forms.
          </p>
          
          <h2 className="text-xl font-serif text-foreground font-medium">4. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
            <br />
            <strong>Mulberry Living</strong><br />
            No 25, Rani Mawatha, Ettukala, Negombo<br />
            Phone/WhatsApp: +94779900394
          </p>
        </div>
      </div>
    </div>
  );
}
