"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function ImageGridSection() {
  // Duplicate the images to create a seamless loop effect
  const gridImages = [
    "/grid/img1.png",
    "/grid/img2.jpg",
    "/grid/img3.jpg",
    "/grid/img4.jpg",
    "/grid/img5.jpg",
    "/grid/img6.jpg",
    "/grid/img7.jpg",
    "/grid/img8.jpg",
    "/grid/img9.png",
    "/grid/img10.jpg",
    "/grid/img11.jpg",
    "/grid/img12.jpg",
  ];

  // Duplicate arrays for seamless scrolling
  const row1Images = [...gridImages, ...gridImages];
  const row2Images = [...gridImages, ...gridImages];
  
  // Use active states for hover effects
  const [activeIndices, setActiveIndices] = useState<{
    [key: string]: boolean;
  }>({});

  const handleMouseEnter = (id: string) => {
    setActiveIndices((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setActiveIndices((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <section className="py-0 pb-24 -mt-10 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Decorative elements */}
        <div className="relative">
          <div className="absolute top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-96 h-20 bg-blue-50 rounded-full filter blur-xl opacity-70"></div>
        </div>

        {/* Image Grid with Animation - As a continuation of the previous section */}
        <div className="relative z-10 mt-6">
          <div className="text-center mb-10 opacity-80">
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Browse our curated selection from top brands and retailers
            </p>
          </div>
          
          {/* First row - slides from left to right */}
          <div className="flex justify-center items-center gap-4 mb-8 overflow-hidden">
            <div className="flex gap-6 animate-slide-slow">
              {row1Images.map((img, index) => (
                <div
                  key={`row1-${index}`}
                  className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex-shrink-0 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
                  onMouseEnter={() => handleMouseEnter(`row1-${index}`)}
                  onMouseLeave={() => handleMouseLeave(`row1-${index}`)}
                >
                  <Image
                    src={img}
                    alt={`Product ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end transition-opacity duration-300 ${
                      activeIndices[`row1-${index}`]
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <div className="p-4 text-white">
                      <p className="font-bold">
                        Product {(index % gridImages.length) + 1}
                      </p>
                      <p className="text-sm">View details</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Second row - slides from right to left */}
          <div className="flex justify-center items-center gap-4 overflow-hidden">
            <div className="flex gap-6 animate-slide-reverse">
              {row2Images.map((img, index) => (
                <div
                  key={`row2-${index}`}
                  className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex-shrink-0 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
                  onMouseEnter={() => handleMouseEnter(`row2-${index}`)}
                  onMouseLeave={() => handleMouseLeave(`row2-${index}`)}
                >
                  <Image
                    src={img}
                    alt={`Product ${index + 7}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end transition-opacity duration-300 ${
                      activeIndices[`row2-${index}`]
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <div className="p-4 text-white">
                      <p className="font-bold">
                        Product {(index % gridImages.length) + 1}
                      </p>
                      <p className="text-sm">View details</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
