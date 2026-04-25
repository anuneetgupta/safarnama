# 🔐 Admin Access - Safarnama

## Admin Credentials

**Username/Email**: `admin`
**Password**: `admin@safarnama.26`

---

## Access Points

### 1. Admin Panel (Direct)
```
URL: http://localhost:3000/admin
```
- Direct access to admin dashboard
- Requires authentication
- Redirects to login if not authenticated

### 2. Login Page
```
URL: http://localhost:3000/auth/login
```
- Use credentials above
- Will redirect to admin panel after login

### 3. Footer Link
- Look for a small dot (•) in the footer
- Located at the bottom right of the page
- Click to access admin panel

---

## Admin Panel Features

### Overview Tab
- Total Users count
- Total Registrations
- Pending Registrations
- Unread Messages

### Users Tab
- View all registered users
- See user details (name, email, phone, college, role)
- View join dates
- Filter by role (admin/user)

### Registrations Tab
- View all trip registrations
- See registration details
- Update registration status:
  - ✓ Confirm registration
  - ✗ Cancel registration
- Filter by status (pending/confirmed/cancelled)

### Messages Tab
- View all contact form messages
- Mark messages as read
- See unread message count
- View message details (name, email, subject, message)

---

## Security Notes

### ⚠️ Important
1. **Change Default Password**: After first login, change the default password
2. **Secure Credentials**: Never commit credentials to version control
3. **Production**: Use strong passwords in production
4. **Environment Variables**: Store credentials in environment variables

### Recommended Actions
1. Change admin password immediately
2. Create additional admin users if needed
3. Implement 2FA for production
4. Regular security audits

---

## Creating Additional Admin Users

### Method 1: Using the Script
```bash
# Edit scripts/create-admin.js
# Change email and password
# Run the script
node scripts/create-admin.js
```

### Method 2: Using Prisma Studio
```bash
npx prisma studio
# Navigate to User model
# Create new user with role: "admin"
```

### Method 3: Promote Existing User
```bash
# Use Prisma Studio or database tool
# Find user by email
# Change role from "user" to "admin"
```

---

## Admin User Details

### Database Record
```
ID: [auto-generated]
Email: admin
Name: Admin
Password: [hashed] admin@safarnama.26
Role: admin
Email Verified: Yes
Created At: [timestamp]
```

### Permissions
- ✅ Access admin panel
- ✅ View all users
- ✅ View all registrations
- ✅ Update registration status
- ✅ View all messages
- ✅ Mark messages as read
- ✅ Full system access

---

## Troubleshooting

### Cannot Login
1. Verify credentials are correct
2. Check if admin user exists in database
3. Run create-admin script again
4. Check browser console for errors

### Admin Panel Not Loading
1. Verify you're logged in
2. Check user role is "admin"
3. Clear browser cache
4. Check dev server is running

### Forgot Password
1. Run create-admin script to reset
2. Or use database tool to update password hash
3. Or implement password reset feature

---

## Footer Admin Link

The admin link in the footer is intentionally subtle:
- Appears as a small dot (•)
- Located at bottom right
- Only visible to those who know
- Hover shows "Admin Access" tooltip

### Why Subtle?
- Security through obscurity
- Prevents casual discovery
- Professional appearance
- Easy access for admins

---

## Production Deployment

### Before Deploying
- [ ] Change default admin password
- [ ] Remove or secure create-admin script
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Configure proper DATABASE_URL
- [ ] Enable HTTPS
- [ ] Implement rate limiting
- [ ] Add 2FA (recommended)
- [ ] Set up monitoring

### Environment Variables
```env
DATABASE_URL=your_production_database_url
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_very_strong_secret_key
```

---

## Quick Reference

| Item | Value |
|------|-------|
| Username | admin |
| Password | admin@safarnama.26 |
| Login URL | /auth/login |
| Admin Panel | /admin |
| Footer Link | • (dot at bottom right) |
| Role | admin |

---

## Support

For issues or questions:
1. Check this documentation
2. Review admin panel code in `app/admin/page.tsx`
3. Check authentication in `auth.ts`
4. Review Prisma schema in `prisma/schema.prisma`

---

**Created**: April 8, 2026
**Status**: ✅ Active
**Security**: ⚠️ Change default password

*Keep this file secure and do not commit to public repositories.*
