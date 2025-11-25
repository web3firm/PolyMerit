'use client';

import { Mail, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        email: '',
        subject: 'General Inquiry',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We\'ll get back to you soon.');
    };

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Contact Us
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Have questions or suggestions? We'd love to hear from you.
                    </p>
                </div>

                {/* Contact Form */}
                <div className="max-w-2xl mx-auto">
                    <div className="card">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold text-gray-900"
                                >
                                    <Mail size={16} className="inline mr-2 text-purple-600" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Subject Field */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="subject"
                                    className="block text-sm font-semibold text-gray-900"
                                >
                                    <MessageSquare size={16} className="inline mr-2 text-purple-600" />
                                    Subject
                                </label>
                                <select
                                    id="subject"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                >
                                    <option>General Inquiry</option>
                                    <option>Bug Report</option>
                                    <option>Feature Request</option>
                                    <option>Partnership</option>
                                </select>
                            </div>

                            {/* Message Field */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-semibold text-gray-900"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={6}
                                    placeholder="How can we help you?"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-vertical"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="btn-primary w-full px-6 py-3 text-base"
                            >
                                <Send size={20} />
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Additional Contact Info */}
                    <div className="mt-12 grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Mail size={24} className="text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                            <p className="text-sm text-gray-600">support@polymerit.app</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <MessageSquare size={24} className="text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Discord</h3>
                            <p className="text-sm text-gray-600">Join our community</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Send size={24} className="text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Twitter</h3>
                            <p className="text-sm text-gray-600">@polymerit</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
