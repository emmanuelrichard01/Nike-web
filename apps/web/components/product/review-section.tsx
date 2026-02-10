"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, Send, Loader2, ChevronDown, User } from "lucide-react";
import { Button } from "@nike/ui";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface ReviewUser {
    id: string;
    name: string | null;
    image: string | null;
}

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: ReviewUser;
}

interface RatingBreakdown {
    stars: number;
    count: number;
}

interface ReviewSectionProps {
    productId: string;
    initialAvgRating: number;
    initialReviewCount: number;
}

function StarRating({
    value,
    onChange,
    size = "md",
    interactive = false,
}: {
    value: number;
    onChange?: (v: number) => void;
    size?: "sm" | "md" | "lg";
    interactive?: boolean;
}) {
    const [hovered, setHovered] = useState(0);
    const sizeClass = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-7 h-7" : "w-5 h-5";

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    onClick={() => onChange?.(star)}
                    onMouseEnter={() => interactive && setHovered(star)}
                    onMouseLeave={() => interactive && setHovered(0)}
                    className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"} p-0 border-0 bg-transparent`}
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                >
                    <Star
                        className={`${sizeClass} transition-colors ${star <= (hovered || value)
                                ? "fill-[#FFB800] text-[#FFB800]"
                                : "fill-black/10 text-black/10"
                            }`}
                    />
                </button>
            ))}
        </div>
    );
}

export function ReviewSection({ productId, initialAvgRating, initialReviewCount }: ReviewSectionProps) {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [avgRating, setAvgRating] = useState(initialAvgRating);
    const [totalReviews, setTotalReviews] = useState(initialReviewCount);
    const [ratingBreakdown, setRatingBreakdown] = useState<RatingBreakdown[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [formRating, setFormRating] = useState(0);
    const [formComment, setFormComment] = useState("");

    const fetchReviews = useCallback(async (p: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/reviews?productId=${productId}&page=${p}&limit=5`);
            if (!res.ok) throw new Error("Failed to fetch reviews");
            const data = await res.json();
            if (p === 1) {
                setReviews(data.reviews);
            } else {
                setReviews((prev) => [...prev, ...data.reviews]);
            }
            setAvgRating(data.averageRating);
            setTotalReviews(data.totalReviews);
            setRatingBreakdown(data.ratingBreakdown);
            setTotalPages(data.pagination.totalPages);
        } catch {
            toast.error("Could not load reviews");
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchReviews(1);
    }, [fetchReviews]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formRating === 0) {
            toast.error("Please select a star rating");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    rating: formRating,
                    comment: formComment.trim() || undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to submit review");
            toast.success(data.message || "Review submitted!");
            setFormRating(0);
            setFormComment("");
            setShowForm(false);
            setPage(1);
            fetchReviews(1);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    const loadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchReviews(next);
    };

    return (
        <section id="reviews" className="mt-16 pt-12 border-t border-black/5 scroll-mt-28">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                            Reviews
                        </h2>
                        <p className="text-black/50 mt-1">
                            {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                        </p>
                    </div>
                    {session ? (
                        <Button
                            onClick={() => setShowForm(!showForm)}
                            className="rounded-full px-6 h-11 font-semibold"
                        >
                            <Star className="w-4 h-4 mr-2" />
                            Write a Review
                        </Button>
                    ) : (
                        <Button asChild variant="outline" className="rounded-full px-6 h-11 font-semibold">
                            <Link href="/auth/signin">Sign in to Review</Link>
                        </Button>
                    )}
                </div>

                {/* Rating Summary */}
                {totalReviews > 0 && (
                    <div className="bg-[#f5f5f5] rounded-2xl p-6 md:p-8 mb-10">
                        <div className="flex flex-col md:flex-row md:items-center gap-8">
                            {/* Average */}
                            <div className="text-center md:text-left flex-shrink-0">
                                <p className="text-5xl font-black">{avgRating.toFixed(1)}</p>
                                <StarRating value={Math.round(avgRating)} size="md" />
                                <p className="text-sm text-black/50 mt-1">
                                    {totalReviews} {totalReviews === 1 ? "rating" : "ratings"}
                                </p>
                            </div>

                            {/* Breakdown bars */}
                            <div className="flex-1 space-y-2">
                                {ratingBreakdown.map((b) => (
                                    <div key={b.stars} className="flex items-center gap-3">
                                        <span className="text-sm font-medium w-4 text-right">{b.stars}</span>
                                        <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                                        <div className="flex-1 h-2.5 bg-black/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#FFB800] rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${totalReviews > 0 ? (b.count / totalReviews) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-black/40 w-8">{b.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Write Review Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleSubmit}
                            className="bg-white border border-black/10 rounded-2xl p-6 md:p-8 mb-10 overflow-hidden"
                        >
                            <h3 className="font-bold text-lg mb-5">Your Review</h3>

                            {/* Star selector */}
                            <div className="mb-5">
                                <label className="text-sm font-semibold text-black/60 block mb-2">
                                    Rating
                                </label>
                                <StarRating
                                    value={formRating}
                                    onChange={setFormRating}
                                    interactive
                                    size="lg"
                                />
                            </div>

                            {/* Comment */}
                            <div className="mb-6">
                                <label className="text-sm font-semibold text-black/60 block mb-2">
                                    Comment (optional)
                                </label>
                                <textarea
                                    value={formComment}
                                    onChange={(e) => setFormComment(e.target.value)}
                                    placeholder="Share your experience with this product..."
                                    maxLength={1000}
                                    rows={4}
                                    className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/20 transition-shadow bg-[#fafafa]"
                                />
                                <p className="text-xs text-black/30 mt-1 text-right">
                                    {formComment.length}/1000
                                </p>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowForm(false)}
                                    className="rounded-full px-6 h-11"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting || formRating === 0}
                                    className="rounded-full px-6 h-11 font-semibold"
                                >
                                    {submitting ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4 mr-2" />
                                    )}
                                    {submitting ? "Submitting..." : "Submit Review"}
                                </Button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                {/* Review List */}
                {loading && reviews.length === 0 ? (
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-black/5 rounded-full" />
                                    <div className="h-4 w-24 bg-black/5 rounded" />
                                </div>
                                <div className="h-3 w-3/4 bg-black/5 rounded mb-2" />
                                <div className="h-3 w-1/2 bg-black/5 rounded" />
                            </div>
                        ))}
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#f5f5f5] flex items-center justify-center">
                            <Star className="w-7 h-7 text-black/20" />
                        </div>
                        <p className="text-black/50 text-lg font-medium">No reviews yet</p>
                        <p className="text-black/30 text-sm mt-1">Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    <div className="space-y-0">
                        {reviews.map((review, idx) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="py-6 border-b border-black/5 last:border-0"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-black/40" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">
                                            {review.user.name || "Nike Member"}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <StarRating value={review.rating} size="sm" />
                                            <span className="text-xs text-black/30">
                                                {new Date(review.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="text-sm text-black/70 leading-relaxed ml-[52px]">
                                        {review.comment}
                                    </p>
                                )}
                            </motion.div>
                        ))}

                        {/* Load More */}
                        {page < totalPages && (
                            <div className="text-center pt-6">
                                <Button
                                    variant="outline"
                                    onClick={loadMore}
                                    disabled={loading}
                                    className="rounded-full px-8 h-11"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 mr-2" />
                                    )}
                                    Load More Reviews
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
