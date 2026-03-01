const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
// const senderEmail = process.env.SENDER_EMAIL;


// =======================
// LOG FUNCTION
// =======================
function logError(context, error) {
  console.error(
    `${context}:`,
    error?.message || error
  );
}

// =======================
// OTP EMAILER
// =======================
async function otpEmailer(ownerEmail, subject, text) {
  try {
    await resend.emails.send({
      from: 'Your Portfolio <onboarding@resend.dev>',
      to: [ownerEmail],
      subject: 'Your OTP from your portfolio',
      html: `<p>${text}</p>`,
    });

    console.log("OTP sent to:", ownerEmail);
  } catch (error) {
    logError("Failed to send OTP", error);
    throw error;
  }
}

// =======================
// CONTACT FORM EMAILER
// =======================
async function contactFormEmailer( visitorName, visitorEmail, message, ownerEmail) 
{
  try {
    await resend.emails.send({
      from: 'Your Portfolio Contact Form <onboarding@resend.dev>',
      to: [ownerEmail],             // portfolio owner
      subject: `Message from "${visitorName}"`,
      html: `
          <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border:1px solid #d2d2d2; border-radius:8px; overflow:hidden;">
            <!-- Header -->
            <div style="background-color:#2d2d2d; padding:15px; text-align:left;">
              <h2 style="margin:0; color:#eeeeee; font-size:20px;">
                📩 New Portfolio Contact Message
              </h2>
            </div>
            <!-- Body Content -->
            <div style="padding:20px; padding-top:16px;">

              <p style="margin:1px 0;">
                <strong>Name:</strong> ${visitorName}
              </p>

              <p style="margin:1px 0;">
                <strong>Email:</strong> ${visitorEmail}
              </p>

              <hr style="margin:17px 0; border:none; border-top:1px solid #dddddd;" />

              <p style="margin-bottom:10px;">
                <strong>Message:</strong>
              </p>

              <div style="background:#eaeaea; padding:15px; border-radius:6px;">
                ${message}
              </div>

              <hr style="margin:20px 0; border:none; border-top:1px solid #dddddd;" />

              <p style="font-size:12px; color:#888888; margin-top:20px;">
                This message was sent from your portfolio contact form.
              </p>
            </div>
          </div>`,
    });

    
    console.log(visitorEmail)
    console.log("Contact form email sent to:", ownerEmail);
  } catch (error) {
    logError("Failed to send contact form", error);
    throw error;
  }
}

module.exports = { otpEmailer, contactFormEmailer };