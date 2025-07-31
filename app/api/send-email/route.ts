import { type NextRequest, NextResponse } from "next/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

export async function POST(request: NextRequest) {
  try {
    const { email, productName, paymentLink, price } = await request.json()

    if (!email || !productName || !paymentLink || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create SES client with explicit credentials
    const sesClient = new SESClient({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })

    const emailParams = {
      Source: process.env.FROM_EMAIL!, // Your verified SES email
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: `Payment Link for ${productName}`,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #1f2937; padding: 20px; text-align: center;">
                  <h1 style="color: white; margin: 0;">
                    insta<span style="color: #f97316;">Rate</span>.
                  </h1>
                </div>
                <div style="padding: 30px; background-color: #f9fafb;">
                  <h2 style="color: #1f2937; margin-bottom: 20px;">Payment Link Ready</h2>
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
                    You've received a payment link for <strong>${productName}</strong> (${price}).
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${paymentLink}" 
                       style="background-color: #f97316; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 6px; font-weight: bold;
                              display: inline-block;">
                      Complete Payment
                    </a>
                  </div>
                  <p style="color: #6b7280; font-size: 14px;">
                    This link will take you to a secure Stripe checkout page to complete your payment.
                  </p>
                </div>
                <div style="background-color: #1f2937; padding: 20px; text-align: center;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    © 2024 InstaRate. All rights reserved.
                  </p>
                </div>
              </div>
            `,
            Charset: "UTF-8",
          },
          Text: {
            Data: `
Payment Link for ${productName}

You've received a payment link for ${productName} (${price}).

Complete your payment here: ${paymentLink}

This link will take you to a secure Stripe checkout page.

© 2024 InstaRate. All rights reserved.
            `,
            Charset: "UTF-8",
          },
        },
      },
    }

    const command = new SendEmailCommand(emailParams)
    await sesClient.send(command)

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
