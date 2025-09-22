"use client";

import React, { useState, useEffect } from "react";
import {
  FiFileText,
  FiShield,
  FiCheckSquare,
  FiChevronDown,
  FiCheck,
} from "react-icons/fi";
import { useParams } from "next/navigation";
import tabData from "../policies.json";

interface Section {
  id: string;
  title: string;
  content: string;
}

const iconMap: Record<string, React.ReactElement> = {
  file: <FiFileText className="text-primary" />,
  shield: <FiShield className="text-primary" />,
  "check-square": <FiCheckSquare className="text-primary" />,
};

export default function Policies() {
  const params = useParams<{ slug?: string }>();

  const [activeTab, setActiveTab] = useState<keyof typeof tabData>("terms");

  useEffect(() => {
    if (params?.slug === "privacy") setActiveTab("privacy");
    else if (params?.slug === "cookie") setActiveTab("cookie");
    else setActiveTab("terms");
  }, [params]);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className="min-h-screen bg-primary py-22 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-4">Policies</h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Learn about our terms, privacy practices, and how we use cookies to
            enhance your experience.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row bg-secondary rounded-xl shadow-lg overflow-hidden mb-8">
          {Object.keys(tabData).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as keyof typeof tabData)}
              className={`flex items-center justify-center gap-2 flex-1 py-4 px-6 text-center font-medium transition-all cursor-pointer ${activeTab === key ? "btn-primary" : "btn-secondary"
                }`}
            >
              {iconMap[tabData[key as keyof typeof tabData].icon]}
              {tabData[key as keyof typeof tabData].title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-secondary rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-primary">
            <div className="flex items-center gap-3 mb-2">
              {iconMap[tabData[activeTab].icon]}
              <h2 className="text-2xl font-bold text-primary">
                {tabData[activeTab].title}
              </h2>
            </div>
            <p className="text-secondary">Last updated: January 15, 2023</p>
          </div>

          <div className="divide-y divide-primary">
            {tabData[activeTab].content.map((section: Section, index: number) => (
              <div key={section.id} className="p-6">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex items-center justify-between w-full text-left group cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent flex items-center justify-center mt-1">
                      <span className="text-white font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors">
                        {section.title}
                      </h3>
                    </div>
                  </div>
                  <FiChevronDown
                    className={`text-secondary transition-transform ${openSections[section.id] ? "rotate-180" : ""
                      }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections[section.id]
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="pl-12 pt-4">
                    <p className="text-secondary leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acceptance Box */}
        <div className="mt-8 bg-secondary rounded-xl shadow-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-success flex items-center justify-center mt-1">
              <FiCheck className="text-white" size={14} />
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">
                Acceptance of Policies
              </h3>
              <p className="text-secondary">
                By using our website, you acknowledge that you have read,
                understood, and agree to be bound by our Terms of Service,
                Privacy Policy, and Cookie Policy.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-6 text-center text-secondary text-sm">
          <p>
            If you have any questions about our policies, please contact us at{" "}
            <a href="mailto:legal@whitebirds.com" className="text-accent underline">
              legal@whitebirds.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
