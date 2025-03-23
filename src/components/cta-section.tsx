import Link from "next/link";
import React from "react";

const CTASection = () => {
  return (
    <section className="max-w-xl w-full text-center mx-auto space-y-8">
      <h1 className="text-4xl font-bold">
        Ready to Transform Your Waste Management Approach?
      </h1>
      <p className="text-base text-[#788763]">
        Join hundreds of forward-thinking organizations already benefiting from
        our innovative waste-to-energy solutions.
      </p>
      <Link
        href="/sign-up"
        className="px-8 py-4 rounded-xl bg-[#87E51A] font-medium text-sm"
      >
        Get started
      </Link>
    </section>
  );
};

export default CTASection;
