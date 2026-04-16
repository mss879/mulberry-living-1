import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Mulberry Living in Negombo, Sri Lanka.",
};

export default function TermsPage() {
  return (
    <div className="pt-32 pb-20 section-padding min-h-[70vh]">
      <div className="container-narrow max-w-3xl space-y-8">
        <h1 className="heading-display">Terms of Service</h1>
        <div className="space-y-6 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-serif text-foreground font-medium">1. Agreement to Terms</h2>
          <p>
            By accessing our website and/or booking a stay at Mulberry Living, you agree to be bound by these 
            Terms of Service. If you disagree with any part of the terms, then you may not access the service.
          </p>
          
          <h2 className="text-xl font-serif text-foreground font-medium">2. Booking and Cancellation</h2>
          <p>
            When you complete a booking request through our website, we will contact you to confirm availability. 
            A booking is only considered confirmed once you receive a confirmation email or message from our team. 
            Cancellation policies may vary based on the specific room or rate selected at the time of confirmation.
          </p>
          
          <h2 className="text-xl font-serif text-foreground font-medium">3. House Rules</h2>
          <p>
            Guests are expected to respect the property, staff, and other guests. We maintain a relaxed and 
            friendly environment, but reserve the right to refuse service or ask guests to leave if their 
            behavior breaks house rules or disrupts the stay of others.
          </p>
          
          <h2 className="text-xl font-serif text-foreground font-medium">4. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
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
