// Copyright 2002-2015, University of Colorado Boulder

//TODO borrow from this, then delete it
/**
 * Demonstration of a spring described by a parametric equation.
 * Separated into a front and back part.
 * Also includes slider controls for the parameters.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var HSlider = require( 'SUN/HSlider' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function MVSpringNode( options ) {

    options = _.extend( {
      stroke: 'black',
      lineWidth: 3,
      lineJoin: 'round'
    }, options );

    Node.call( this );

    // properties
    var pitchSizeProperty = new Property( 2 );
    var deltaPhaseProperty = new Property( 1 );
    var aspectRatioProperty = new Property( 1 );

    // sliders
    var pitchSizeSlider = new HSlider( pitchSizeProperty, new Range( 0.1, 2 ), {
      centerX: 50,
      centerY: 200
    } );
    var deltaPhaseSlider = new HSlider( deltaPhaseProperty, new Range( 0, 7 ), {
      centerX: pitchSizeSlider.centerX,
      centerY: pitchSizeSlider.centerY + 100
    } );
    var aspectRatioSlider = new HSlider( aspectRatioProperty, new Range( 0.3, 3 ), {
      centerX: deltaPhaseSlider.centerX,
      centerY: deltaPhaseSlider.centerY + 100
    } );
    this.addChild( pitchSizeSlider );
    this.addChild( deltaPhaseSlider );
    this.addChild( aspectRatioSlider );

    var index; // reused herein
    var xOffset = 150;
    var yOffset = 300;
    var amplitude = 50;
    var phase = 0;
    var pointsPerLoop = 50;
    var loops = 10;
    var arrayLength = pointsPerLoop * loops;

    // Spring drawn using a single path
    var springPath = new Path( null, {
      stroke: options.stroke, lineWidth: options.lineWidth
    } );
    this.addChild( springPath );

    // Update the spring path
    Property.multilink( [ pitchSizeProperty, deltaPhaseProperty, aspectRatioProperty ],
      function( pitchSize, deltaPhase, aspectRatio ) {
        var arrayPosition = [];
        for ( index = 0; index < arrayLength; index++ ) {
          var xCoordinate = xOffset + amplitude * Math.cos( 2 * Math.PI * index / pointsPerLoop + phase ) + pitchSize * (index / pointsPerLoop) * amplitude;
          var yCoordinate = yOffset + aspectRatio * amplitude * Math.cos( 2 * Math.PI * index / pointsPerLoop + deltaPhase + phase );
          arrayPosition.push( new Vector2( xCoordinate, yCoordinate ) );
        }
        springPath.shape = new Shape();
        springPath.shape.moveToPoint( arrayPosition[ 0 ] );
        for ( index = 1; index < arrayLength; index++ ) {
          springPath.shape.lineToPoint( arrayPosition[ index ] );
        }
      } );

    // Spring drawn using 2 paths, split into front and back pieces to add depth
    var frontPath = new Path( null, {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );
    var backPath = new Path( null, {
      stroke: 'pink',
      lineWidth: options.lineWidth
    } );
    this.addChild( backPath );
    this.addChild( frontPath );

    // Update the front and back paths
    Property.multilink( [ pitchSizeProperty, deltaPhaseProperty, aspectRatioProperty ],
      function( pitchSize, deltaPhase, aspectRatio ) {
        var arrayPosition = [];
        for ( index = 0; index < arrayLength; index++ ) {
          var xCoordinate = xOffset + amplitude * Math.cos( 2 * Math.PI * index / pointsPerLoop + phase ) + pitchSize * (index / pointsPerLoop) * amplitude;
          var yCoordinate = yOffset + 150 + aspectRatio * amplitude * Math.cos( 2 * Math.PI * index / pointsPerLoop + deltaPhase + phase );
          arrayPosition.push( new Vector2( xCoordinate, yCoordinate ) );
        }
        frontPath.shape = new Shape();
        backPath.shape = new Shape();

        frontPath.shape.moveToPoint( arrayPosition[ 0 ] );
        backPath.shape.moveToPoint( arrayPosition[ 0 ] );
        var wasFront = true;
        for ( index = 1; index < arrayLength; index++ ) {

          var isFront = ( ( 2 * Math.PI * index / pointsPerLoop + phase + deltaPhase ) % ( 2 * Math.PI ) < Math.PI );

          if ( !wasFront && isFront ) {
            wasFront = true;
            frontPath.shape.moveToPoint( arrayPosition[ index - 1 ] );
          }

          if ( wasFront && !isFront ) {
            wasFront = false;
            backPath.shape.moveToPoint( arrayPosition[ index - 1 ] );
          }

          if ( !wasFront && !isFront ) {
            backPath.shape.lineToPoint( arrayPosition[ index ] );
          }

          if ( wasFront && isFront ) {
            frontPath.shape.lineToPoint( arrayPosition[ index ] );
          }
        }
      } );

    this.mutate( options );
  }

  return inherit( Node, MVSpringNode );
} );

