const path = require("path");
const { HTTP_STATUS } = require("../utils/http");
const router = require("express").Router();
const { FileManager } = require("../managers/fileManager");
const { ReviewManager } = require("../managers/reviewManager");

const reviewManager = new ReviewManager(new FileManager(path.join(__dirname + "/../data/reviews.json")));

router.get("/", async (request, response) => {
    try {
        const reviews = await reviewManager.getReviews();

        if (reviews.length !== 0) {
            response.status(HTTP_STATUS.SUCCESS).json(reviews);
        } else {
            response.status(HTTP_STATUS.NO_CONTENT).send();
        }
    } catch (error) {
        response.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

router.get("/:partnerId", async (request, response) => {
    try {
        const reviews = await reviewManager.getReviewsForPartner(request.params.partnerId);

        if (reviews.length !== 0) {
            response.status(HTTP_STATUS.SUCCESS).json(reviews);
        } else {
            response.status(HTTP_STATUS.NO_CONTENT).send();
        }
    } catch (error) {
        response.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

router.patch("/:reviewId", async (request, response) => {
    try {
        const reviewId = request.params.reviewId;
        const updatedReview = await reviewManager.likeReview(reviewId);
        if (updatedReview) {
            const reviews = await reviewManager.getReviews();
            const review = reviews.find((review) => review.id === reviewId);
            response.status(HTTP_STATUS.SUCCESS).json(review);
        } else {
            response.status(HTTP_STATUS.NOT_FOUND).send("Review not found");
        }
    } catch (error) {
        response.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

router.delete("/:reviewId", async (request, response) => {
    try {
        const reviewId = request.params.reviewId;
        const success = await reviewManager.deleteReviewsMatchingPredicate(review => review.id === reviewId);

        if (success) {
            response.status(HTTP_STATUS.SUCCESS).json(true);
        } else {
            response.status(HTTP_STATUS.NOT_FOUND).json(false);
        }
    } catch (error) {
        response.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

router.post("/", async (request, response) => {
    try {
        const newReview = request.body;
        console.log(newReview)
        if (!newReview.rating || !newReview.comment || !newReview.author ){
            response.status(HTTP_STATUS.BAD_REQUEST).json(false);
            return;
        } 
        const addedReview = await reviewManager.addReview(newReview);
        console.log("ntm")
        console.log(addedReview)
        response.status(HTTP_STATUS.CREATED).json(addedReview);
        
    } catch (error) {
        response.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});


module.exports = { router, reviewManager };