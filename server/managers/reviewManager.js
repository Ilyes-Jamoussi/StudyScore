const { randomUUID } = require("crypto");

class ReviewManager {
    constructor(fileManager) {
        this.fileManager = fileManager;
    }


    async getReviews() {
        const reviewsData = await this.fileManager.readFile();
        return JSON.parse(reviewsData);
    }


    async getReviewsForPartner(partnerId) {
        const reviews = await this.getReviews();
        return reviews.filter(review => review.reviewedPartnerId === partnerId);
    }


    async addReview(review) {
        review.id = randomUUID();
        const reviews = await this.getReviews();
        reviews.push(review);
        await this.fileManager.writeFile(JSON.stringify(reviews, null, 2));
        return reviews;
    }


    async likeReview(reviewId) {
        const reviews = await this.getReviews();
        const index = reviews.findIndex(review => review.id === reviewId);

        if (index !== -1) {
            reviews[index].likes = (reviews[index].likes || 0) + 1;
            await this.fileManager.writeFile(JSON.stringify(reviews, null, 2));
            return true;
        }

        return false;
    }


    async deleteReviewsMatchingPredicate(predicate) {
        const reviews = await this.getReviews();
        const remainingReviews = reviews.filter(review => !predicate(review));
        await this.fileManager.writeFile(JSON.stringify(remainingReviews, null, 2));
        return remainingReviews.length !== reviews.length;
    }
}

module.exports = { ReviewManager };
