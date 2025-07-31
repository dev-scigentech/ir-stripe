import { type NextRequest, NextResponse } from "next/server"
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, productName, paymentLink, price } = await request.json()

    if (!phoneNumber || !productName || !paymentLink || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create SNS client with explicit credentials
    const snsClient = new SNSClient({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })

    // Format phone number (ensure it starts with +)
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`

    const message = `InstaRate Payment Link

${productName} - (Annual fee)

Complete your payment: ${paymentLink}

Secure checkout via Stripe.`

    const smsParams = {
      PhoneNumber: formattedPhone,
      Message: message,
      MessageAttributes: {
        "AWS.SNS.SMS.SenderID": {
          DataType: "String",
          StringValue: "InstaRate",
        },
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: "Transactional",
        },
      },
    }

    const command = new PublishCommand(smsParams)
    await snsClient.send(command)

    return NextResponse.json({ success: true, message: "SMS sent successfully" })
  } catch (error) {
    console.error("Error sending SMS:", error)
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 })
  }
}
