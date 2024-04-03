import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { CircularProgress } from '@mui/material';
import './Loading.css'
const Loading = () => {
  return (
    <>
      <Box sx={{ width: '100%' }}>
      <LinearProgress className='mb-5' />
    </Box>
        <div className="container-loading">
        <Box sx={{ display: 'flex' }} >
        <CircularProgress style={{margin:"30%", width: '80px', height: '80px'}} className='mt-5'  />
        </Box>
        </div>

    </>
)
}

export default Loading