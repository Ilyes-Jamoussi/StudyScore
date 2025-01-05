const { randomUUID } = require("crypto");

class PartnerManager {
    constructor(fileManager) {
        this.fileManager = fileManager;
    }

    async getPartners() {
        const partnersData = await this.fileManager.readFile();
        return JSON.parse(partnersData);
    }

    async getPartner(partnerId) {
        const partners = await this.getPartners();
        const foundPartner = partners.find(partner => partner.id === partnerId);
        return foundPartner;
    }


    async addPartner(partner) {
        partner.id = randomUUID();
        const partners = await this.getPartners();
        partners.push(partner);
        await this.fileManager.writeFile(JSON.stringify(partners, null, 2));
        return partners;
    }

    async deletePartner(partnerId) {
        const partners = await this.getPartners();
        const partnerIndex = partners.findIndex(partner => partner.id === partnerId);

        if (partnerIndex !== -1) {
            partners.splice(partnerIndex, 1);
            await this.fileManager.writeFile(JSON.stringify(partners, null, 2));
            return true;
        } else {
            return false;
        }
    }
}

module.exports = { PartnerManager };
