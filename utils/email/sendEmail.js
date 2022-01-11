// Install with: npm install @trycourier/courier
const { CourierClient } = require("@trycourier/courier");

const courier = CourierClient({ authorizationToken: "dk_prod_GK12EN67ST45AYHV2XV9ZEN0YN2R" });

const sendEmail = async (email, payload) => {
  const { messageId } = await courier.send({
    brand: "NK705MB72F4RXKQETMZE65SW4BS7",
    eventId: "WH46YVMBJ0MHFTGTP7T4CN7J1JQE",
    recipientId: "727c26ba-3499-4e9c-bee4-0bbee6a17f3d",
    profile: {
      email: email,
    },
    data: {
      name: payload.name,
      link: payload.link,
    },
    override: {
    },
  });

};

module.exports = sendEmail;
