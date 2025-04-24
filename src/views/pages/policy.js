import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Box sx={{ bgcolor: '#f4f4f4', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" color="primary" gutterBottom>
            Privacy Policy for Hostel CRM
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Effective Date:</strong> 25 June 2024
          </Typography>

          <Typography variant="h5" component="h2" color="primary" gutterBottom>
            1. Introduction
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to Hostel CRM, a product of Samyotech Software Solutions Pvt Ltd. We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information when you use our Hostel CRM services.
          </Typography>

          <Typography variant="h5" component="h2" color="primary" gutterBottom>
            2. Information We Collect
          </Typography>

          <Typography variant="h6" component="h3" color="primary" gutterBottom>
            2.1 Personal Information
          </Typography>
          <Typography variant="body1" paragraph>
            We collect personal information that you voluntarily provide to us, including but not limited to:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Name" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Email address" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Phone number" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Address" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Payment information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Other identifiable information you provide while using our services" />
            </ListItem>
          </List>

          <Typography variant="h6" component="h3" color="primary" gutterBottom>
            2.2 Usage Data
          </Typography>
          <Typography variant="body1" paragraph>
            We automatically collect certain information when you use our services, including:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="IP address" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Browser type and version" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Pages visited" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Time and date of visit" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Time spent on pages" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Other diagnostic data" />
            </ListItem>
          </List>

          <Typography variant="h6" component="h3" color="primary" gutterBottom>
            2.3 Cookies and Tracking Technologies
          </Typography>
          <Typography variant="body1" paragraph>
            We use cookies and similar tracking technologies to monitor activity and store certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
          </Typography>

          <Typography variant="h5" component="h2" color="primary" gutterBottom>
            3. Use of Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the collected information for various purposes, including:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="To provide and maintain our services" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To notify you about changes to our services" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To allow you to participate in interactive features" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To provide customer support" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To gather analysis or valuable information to improve our services" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To monitor the usage of our services" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To detect, prevent, and address technical issues" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To send you marketing and promotional materials (you can opt-out at any time)" />
            </ListItem>
          </List>

          <Typography variant="h5" component="h2" color="primary" gutterBottom>
            4. Sharing and Disclosure of Information
          </Typography>
          <Typography variant="body1" paragraph>
            We do not sell, trade, or otherwise transfer your personal information to outside parties except as described in this Privacy Policy. We may share your information with:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Service providers who assist us in operating our services" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Affiliates and business partners" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Law enforcement or regulatory agencies if required by law" />
            </ListItem>
            <ListItem>
              <ListItemText primary="In connection with a merger, acquisition, or sale of assets" />
            </ListItem>
          </List>

          <Typography variant="h5" component="h2" color="primary" gutterBottom>
            5. Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We employ appropriate security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or method of electronic storage is 100% secure.
          </Typography>

          <Typography variant="h5" component="h2" color="primary" gutterBottom>
            6. Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="The right to access" />
            </ListItem>
            <ListItem>
              <ListItemText primary="The right to rectification" />
            </ListItem>
            <ListItem>
              <ListItemText primary="The right to erasure" />
            </ListItem>
            <ListItem>
              <ListItemText primary="The right to restrict processing" />
            </ListItem>
            <ListItem>
              <ListItemText primary="The right to data portability" />
            </ListItem>
            <ListItem>
              <ListItemText primary="The right to object" />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph>
            To exercise these rights, please contact us at [Your Contact Information].
          </Typography>

          <Typography variant="h5" component="h2" color="primary" gutterBottom>
            7. Childrens Privacy
          </Typography>
          <Typography variant="body1" paragraph>
            Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information.
          </Typography>

          <Typography variant="h5" component="h2" color="primary" gutterBottom>
            8. Changes to This Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </Typography>

          <Typography variant="h5" component="h2" color="primary" gutterBottom>
            9. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about this Privacy Policy, please contact us at:
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Email:</strong> amit@samyotech.com <br />
            <strong>Address:</strong> Vijay Nagar Indore
          </Typography>

          <Typography variant="body1" paragraph>
            Thank you for using Hostel CRM. Your privacy is important to us, and we are committed to protecting your personal information.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};
export default PrivacyPolicy;

