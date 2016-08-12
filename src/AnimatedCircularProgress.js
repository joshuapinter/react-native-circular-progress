import React, { PropTypes } from 'react';
import { View, Animated } from 'react-native';
import CircularProgress from './CircularProgress';
const AnimatedProgress = Animated.createAnimatedComponent(CircularProgress);

export default class AnimatedCircularProgress extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      chartFillAnimation: new Animated.Value(props.prefill || 0),
      tintColorPercentage: 0,
    }
  }

  componentDidMount() {
    this.animateFill();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fill !== this.props.fill) {
      this.animateFill();
    }
  }

  animateFill() {
    const { tension, friction } = this.props;

    Animated.spring(
      this.state.chartFillAnimation,
      {
        toValue: this.props.fill,
        tension,
        friction
      }
    ).start();
  }

  performLinearAnimation(toValue, duration) {
    Animated.timing(this.state.chartFillAnimation, {
      toValue: toValue,
      duration: duration
    }).start();

    this.changeValueOverTime(this.state.tintColorPercentage, 0, 100, duration, 100);
  }

  changeValueOverTime( value, start, end, duration, framerate) {
    var increment = ( ( end - start ) * framerate ) / duration;

    var positive = ( end > start ? true : false );

    var interval = setInterval( () => {
      if ( ( positive && value >= end ) || ( !positive && value <= end ) ) {
    	  clearInterval(interval);
        return;
      }

    	value += increment;

      this.setState({tintColorPercentage: value});

    }, framerate);
  }

  hsl_col_perc(percent,start,end) {
		 var fraction = percent / 100;

     var change = ( end - start ) * fraction;

     var hue = start + change;

		return 'hsl(' + hue + ',100%,50%)';
  }

  render() {
    const { fill, prefill, ...other } = this.props;

    console.log("tintColorPercentage2:");
    console.log(this.state.tintColorPercentage);

    let tintColor = this.hsl_col_perc(this.state.tintColorPercentage, 100, 0);

    console.log("tintColor:");
    console.log(tintColor);

    return (
      <AnimatedProgress
        {...other}
        fill={this.state.chartFillAnimation}
        tintColor={tintColor}
        />
    )
  }
}

AnimatedCircularProgress.propTypes = {
  style: View.propTypes.style,
  size: PropTypes.number.isRequired,
  fill: PropTypes.number,
  prefill: PropTypes.number,
  width: PropTypes.number.isRequired,
  tintColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  tension: PropTypes.number,
  friction: PropTypes.number
}

AnimatedCircularProgress.defaultProps = {
  tension: 7,
  friction: 10
};
