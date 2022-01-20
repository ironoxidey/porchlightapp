import React, { Fragment } from 'react';
import { SpinnerCircular } from 'spinners-react';
//import spinner from '../../img/spinner.gif';

export default () => (
	<Fragment>
		<div className='spinner'>
			<SpinnerCircular
				size={60}
				thickness={130}
				speed={75}
				color='rgba(255, 255, 217, 1)'
				secondaryColor='rgba(16, 15, 14, 1)'
			/>
		</div>
		{/* <img
      src={spinner}
      style={{ width: '200px', margin: 'auto', display: 'block' }}
      alt='Loading...'
    /> */}
	</Fragment>
);
