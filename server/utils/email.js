/**
 * Email Utility
 * Handles sending emails with Nodemailer
 */

const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  const port = parseInt(process.env.EMAIL_PORT) || 587;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: port,
    secure: port === 465, // Use SSL for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send order confirmation email
exports.sendOrderConfirmation = async (order, user) => {
  try {
    const transporter = createTransporter();

    // Format order items
    const itemsList = order.items.map(item => 
      `- ${item.name} x ${item.quantity} = ${order.currency} ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'icestore <noreply@icestore.com>',
      to: user.email,
      subject: `Order Confirmation - icestore #${order._id.toString().slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a2e; color: #ffffff; padding: 20px;">
          <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #4a0e78;">
            <h1 style="color: #9b59b6; margin: 0;">icestore</h1>
            <p style="color: #888; margin: 5px 0;">Your premium shopping destination</p>
          </div>
          
          <div style="padding: 30px 0;">
            <h2 style="color: #9b59b6;">Thank you for your order!</h2>
            <p>Hi ${user.name},</p>
            <p>Your order has been confirmed and is being processed.</p>
            
            <div style="background-color: #2a2a4e; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #9b59b6; margin-top: 0;">Order Details</h3>
              <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>
            
            <div style="background-color: #2a2a4e; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #9b59b6; margin-top: 0;">Items Ordered</h3>
              ${order.items.map(item => `
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #3a3a5e;">
                  <span>${item.name} x ${item.quantity}</span>
                  <span>${order.currency} ${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              `).join('')}
              <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #9b59b6;">
                <div style="display: flex; justify-content: space-between;">
                  <strong>Total:</strong>
                  <strong style="color: #9b59b6;">${order.currency} ${order.totalAmount.toFixed(2)}</strong>
                </div>
              </div>
            </div>
            
            <div style="background-color: #2a2a4e; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #9b59b6; margin-top: 0;">Shipping Address</h3>
              <p style="margin: 0;">
                ${order.shippingAddress.fullName}<br>
                ${order.shippingAddress.street}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
                ${order.shippingAddress.country}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #4a0e78; color: #888;">
            <p>Thank you for shopping with icestore!</p>
            <p style="font-size: 12px;">If you have any questions, please contact us at support@icestore.com</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Order confirmation email sent to ${user.email}`);

    // Also send notification to admin
    if (process.env.ADMIN_EMAIL) {
      const adminMailOptions = {
        from: process.env.EMAIL_FROM || 'icestore <noreply@icestore.com>',
        to: process.env.ADMIN_EMAIL,
        subject: `New Order - icestore #${order._id.toString().slice(-8).toUpperCase()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New Order Received</h2>
            <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
            <p><strong>Customer:</strong> ${user.name} (${user.email})</p>
            <p><strong>Total:</strong> ${order.currency} ${order.totalAmount.toFixed(2)}</p>
            <p><strong>Items:</strong></p>
            <pre>${itemsList}</pre>
          </div>
        `
      };
      await transporter.sendMail(adminMailOptions);
      console.log(`📧 Admin notification email sent to ${process.env.ADMIN_EMAIL}`);
    }

    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Send welcome email
exports.sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'icestore <noreply@icestore.com>',
      to: user.email,
      subject: 'Welcome to icestore!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a2e; color: #ffffff; padding: 20px;">
          <div style="text-align: center; padding: 20px 0;">
            <h1 style="color: #9b59b6; margin: 0;">Welcome to icestore!</h1>
          </div>
          <div style="padding: 30px 0;">
            <p>Hi ${user.name},</p>
            <p>Thank you for joining icestore! We're excited to have you as part of our community.</p>
            <p>Start exploring our products from Algeria, Tunisia, and Italy.</p>
            ${user.role === 'seller' ? `
              <p style="color: #f39c12;">Your seller account is pending approval. We'll notify you once it's approved.</p>
            ` : ''}
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL}" style="background-color: #9b59b6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">
                Start Shopping
              </a>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Welcome email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error('Welcome email error:', error);
    return false;
  }
};
