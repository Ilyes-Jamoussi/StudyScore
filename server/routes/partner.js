const path = require("path");
const { HTTP_STATUS } = require("../utils/http");
const router = require("express").Router();
const { FileManager } = require("../managers/fileManager");
const { PartnerManager } = require("../managers/partnerManager");
const { ReviewManager } = require("../managers/reviewManager");


const partnerManager = new PartnerManager(new FileManager(path.join(__dirname + "/../data/partners.json")));
const reviewManager = new ReviewManager(new FileManager(path.join(__dirname + "/../data/reviews.json")));

router.get("/", async (request, response) => {
    try {
        const partners = await partnerManager.getPartners();

        if (partners.length !== 0) {
            response.status(HTTP_STATUS.SUCCESS).json(partners);
        } else {
            response.status(HTTP_STATUS.NO_CONTENT).send();
        }
    } catch (error) {
        response.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

router.get("/:partnerId", async (request, response) => {
    try {
        const partner = await partnerManager.getPartner(request.params.partnerId);
        if (partner) {
            response.status(HTTP_STATUS.SUCCESS).json(partner);
        } else {
            response.status(HTTP_STATUS.NOT_FOUND).send("Partner not found");
        }
    } catch (error) {
        response.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

router.delete("/:partnerId", async (request, response) => {
    try {
        const partnerId = request.params.partnerId;
        const partner = await partnerManager.deletePartner(partnerId);
        if (partner) {
            await reviewManager.deleteReviewsMatchingPredicate(review => review.reviewedPartnerId === partnerId);
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
        const newPartner = request.body;
        if (!newPartner.firstName || !newPartner.lastName || !newPartner.school || !newPartner.program){
            response.status(HTTP_STATUS.BAD_REQUEST).send("Missing required partner data");
        } else {
            const addedPartner = await partnerManager.addPartner(newPartner);
            response.status(HTTP_STATUS.CREATED).json(newPartner);
        }
    } catch (error) {
        response.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
});

module.exports = { router, partnerManager };