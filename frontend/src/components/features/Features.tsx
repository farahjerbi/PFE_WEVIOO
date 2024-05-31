import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import EdgesensorHighRoundedIcon from '@mui/icons-material/EdgesensorHighRounded';
import ViewQuiltRoundedIcon from '@mui/icons-material/ViewQuiltRounded';
import { EmailTemplate } from '../../models/email/EmailTemplate';

import {  useSelector } from 'react-redux';
import { selectSavedEmails } from '../../redux/state/emailSlice';

import SheetContent from '../sheet/SheetContent';
import { selectSavedSMSs } from '../../redux/state/smsSlice';
import { selectSavedPushs } from '../../redux/state/pushSlice';
import SheetContentPush from '../sheet/SheetContentPush';

const items = [
  {
    icon: <ViewQuiltRoundedIcon className='blue'/>,
    title: 'Emails',
    description:
      'This item could provide a snapshot of the most important metrics or data points related to the product.',
    image: 'url("../../../assets/email-dash.gif")',
  },
  {
    icon: <EdgesensorHighRoundedIcon className='purple' />,
    title: 'SMS',
    description:
      'This item could provide information about the mobile app version of the product.',
    image: 'url("../../../assets/sms-dash.gif")',
  },
  {
    icon: <DevicesRoundedIcon className='baby-blue' />,
    title: 'Push',
    description:
      'This item could let users know the product is available on all platforms, such as web, mobile, and desktop.',
    image: 'url("../../../assets/push-dash.gif")',
  },
 
];

export default function Features() {
  const emails=useSelector(selectSavedEmails)
  const sms= useSelector(selectSavedSMSs)
  const push=useSelector(selectSavedPushs)
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0)

  const handleItemClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container style={{marginLeft:"12%"}} id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Grid container spacing={6} >
        <Grid item xs={12} md={6}>
          <div>
            <Typography component="h2" variant="h4" color="text.primary">
              Saved Templates
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: { xs: 2, sm: 4 } }}
            >
              Here you can provide a brief overview of the key features of the
              product. For example, you could list the number of features, the types
              of features, add-ons, or the benefits of the features.
            </Typography>
          </div>
          <Grid container item gap={1} sx={{ display: { xs: 'auto', sm: 'none' } }}>
            {items.map(({ title }, index) => (
              <Chip
                key={index}
                label={title}
                onClick={() => handleItemClick(index)}
                sx={{
                  borderColor: selectedItemIndex === index ? 'primary.light' : '',
                  backgroundColor: selectedItemIndex === index ? 'primary.main' : '',
                  '& .MuiChip-label': {
                    color: selectedItemIndex === index ? '#fff' : '',
                  },
                }}
              />
            ))}
          </Grid>
          <Box
            component={Card}
            variant="outlined"
            sx={{
              display: { xs: 'auto', sm: 'none' },
              mt: 4,
            }}
          >
            <Box
              sx={{
                backgroundImage: selectedFeature.image,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: 280,
              }}
            />
            <Box sx={{ px: 2, pb: 2 }}>
              <Typography color="text.primary" variant="body2" fontWeight="bold">
                {selectedFeature.title}
              </Typography>
              <Typography color="text.secondary" variant="body2" sx={{ my: 0.5 }}>
                {selectedFeature.description}
              </Typography>
              <Link
                color="primary"
                variant="body2"
                fontWeight="bold"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  '& > svg': { transition: '0.2s' },
                  '&:hover > svg': { transform: 'translateX(2px)' },
                }}
              >
                <p>Learn more</p>
                <ChevronRightRoundedIcon
                  fontSize="small"
                  sx={{ mt: '1px', ml: '2px' }}
                />
              </Link>
            </Box>
          </Box>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            spacing={2}
            useFlexGap
            sx={{ width: '100%', display: { xs: 'none', sm: 'flex' } }}
          >
            {items.map(({ icon, title, description }, index) => (
              <Card
                key={index}
                variant="outlined"
                component={Button}
                onClick={() => handleItemClick(index)}
                sx={{
                  p: 3,
                  height: 'fit-content',
                  width: '100%',
                  background: 'none',
                  backgroundColor:
                    selectedItemIndex === index ? 'action.selected' : undefined,
                  borderColor: selectedItemIndex === index ? 'primary.light' : 'grey.200',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    textAlign: 'left',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { md: 'center' },
                    gap: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      color: selectedItemIndex === index ? 'primary.main' : 'grey.300',
                    }}
                  >
                    {icon}
                  </Box>
                  <Box sx={{ textTransform: 'none' }}>
                    <Typography
                      color="text.primary"
                      variant="body2"
                      fontWeight="bold"
                    >
                      {title}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      sx={{ my: 0.5 }}
                    >
                      {description}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: { xs: 'none', sm: 'flex' }, width: '100%' }}
        >    
       {selectedItemIndex === 0 && emails && (
          <SheetContent templates={emails} type='email' />
      )}
         {selectedItemIndex === 1 && sms && (
          <SheetContent templates={sms} type='sms' />
      )}
         {selectedItemIndex === 2 && push && (
          <SheetContentPush templates={push}  />
      )}
        </Grid>
      </Grid>
   
    </Container>
    
  );
}
