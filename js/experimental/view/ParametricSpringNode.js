// Copyright 2002-2015, University of Colorado Boulder

/**
 * Spring described by a parametric equation.
 *
 * @author Martin Veillette (Berea College)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {ExperimentalModel} model
   * @param {Object} [options]
   * @constructor
   */
  function ParametricSpringNode( model, options ) {

    options = _.extend( {
      paths: 1, // {number} 1 = single path, 2 = separate front and back paths
      frontStroke: 'black',
      backStroke: 'black',
      loops: 10, // {number} number of loops in the coil
      pointsPerLoop: 50, // {number} number of points used to approximate each loop
      phase: 0 //TODO describe this, add a control?
    }, options );
    assert && assert( options.paths === 1 || options.paths === 2 );

    Node.call( this );


    var backPath = new Path( null, {
      stroke: options.backStroke
    } );
    if ( options.paths === 2 ) {
      this.addChild( backPath );
    }

    // frontPath is also the sole path when options.paths === 1
    var frontPath = new Path( null, {
      stroke: options.frontStroke
    } );
    this.addChild( frontPath );

    var arrayLength = options.loops * options.pointsPerLoop;
    var index;

    // Update the spring geometry
    Property.multilink( [ model.pitchSizeProperty, model.deltaPhaseProperty, model.aspectRatioProperty, model.amplitudeProperty ],
      function( pitchSize, deltaPhase, aspectRatio, amplitude ) {

        //TODO expand doc for the parametric equation, add a reference
        // compute the points
        var arrayPosition = [];
        for ( index = 0; index < arrayLength; index++ ) {
          var xCoordinate = amplitude * Math.cos( 2 * Math.PI * index / options.pointsPerLoop + options.phase ) + pitchSize * (index / options.pointsPerLoop) * amplitude;
          var yCoordinate = aspectRatio * amplitude * Math.cos( 2 * Math.PI * index / options.pointsPerLoop + deltaPhase + options.phase );
          arrayPosition.push( new Vector2( xCoordinate, yCoordinate ) );
        }

        if ( options.paths === 1 ) {
          // one path
          frontPath.shape = new Shape();
          frontPath.shape.moveToPoint( arrayPosition[ 0 ] );
          for ( index = 1; index < arrayLength; index++ ) {
            frontPath.shape.lineToPoint( arrayPosition[ index ] );
          }
        }
        else {
          // separate paths for front and back
          frontPath.shape = new Shape();
          backPath.shape = new Shape();
          frontPath.shape.moveToPoint( arrayPosition[ 0 ] );
          backPath.shape.moveToPoint( arrayPosition[ 0 ] );
          var wasFront = true; // was the previous point on the front path?
          for ( index = 1; index < arrayLength; index++ ) {

            // is the current point on the front path?
            var isFront = ( ( 2 * Math.PI * index / options.pointsPerLoop + options.phase + deltaPhase ) % ( 2 * Math.PI ) < Math.PI );

            if ( isFront ) {
              // we're in the front
              if ( !wasFront ) {
                // ... and we've just moved to the front
                frontPath.shape.moveToPoint( arrayPosition[ index - 1 ] );
              }
              frontPath.shape.lineToPoint( arrayPosition[ index ] );
            }
            else {
              // we're in the back
              if ( wasFront ) {
                // ... and we've just moved to the back
                backPath.shape.moveToPoint( arrayPosition[ index - 1 ] );
              }
              backPath.shape.lineToPoint( arrayPosition[ index ] );
            }

            wasFront = isFront;
          }
        }
      } );

    // Update the line width
    model.lineWidthProperty.link( function( lineWidth ) {
      frontPath.lineWidth = backPath.lineWidth = lineWidth;
    } );

    this.mutate( options );
  }

  return inherit( Node, ParametricSpringNode );
} );