// Copyright 2002-2015, University of Colorado Boulder

/**
 * Spring described by a parametric equation. This implementation is a variation of the cycloid equation.
 * A prolate cycloid (see http://mathworld.wolfram.com/ProlateCycloid.html) comes closest to this implementation,
 * although it doesn't include aspect ratio and delta phase.
 *
 * The origin (0, 0) of this node is at its left center.
 * The front and back of the spring are drawn as separate paths to provide pseudo-3D visual cues.
 * Performance can be improved dramatically by setting options.pathBoundsMethod to 'none', at
 * the expense of layout accuracy. If you use this option, you can only rely on Node.x and Node.y for
 * doing layout.  See Path.boundsMethod for additional details.
 *
 * The "Experimental" screen provides an extensive test harness for ParametricSpringNode.
 * Run with query parameter "exp" to add the "Experimental" screen to the sim.
 *
 * @author Martin Veillette (Berea College)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var SHOW_ORIGIN = false; // {boolean} draws a red circle at the origin, for layout debugging

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ParametricSpringNode( options ) {

    options = _.extend( {

      // {Color|string} colors used for the gradient strokes. middleColor is the dominant color.
      frontColor: 'lightGray',
      middleColor: 'gray',
      backColor: 'black',

      // {number} length of the horizontal line added to the left end of the coil
      leftEndLength: 15,

      // {number} length of the horizontal line added to the right end of the coil
      rightEndLength: 25,

      // {number} number of loops in the coil
      loops: 10,

      // {number} number of points used to approximate 1 loop of the coil
      pointsPerLoop: 40,

      // {number} radius of a loop with aspect ratio of 1:1
      radius: 10,

      // {number} y:x aspect ratio of the loop radius
      aspectRatio: 4,

      // {number} lineWidth used to stroke the Paths
      lineWidth: 3,

      // {number} phase angle of where the loop starts, period is (0,2*PI) radians, counterclockwise
      phase: Math.PI,

      // {number} responsible for the leaning of the coil, variation on a Lissjoue curve, period is (0,2*PI) radians
      deltaPhase: Math.PI / 2,

      // {number} multiplier for radius in the x dimensions, makes the coil appear to get longer
      xScale: 2.5,

      // {string} method used to compute bounds for scenery.Path components, see Path.boundsMethod
      pathBoundsMethod: 'accurate'
    }, options );

    var thisNode = this;

    this.model = new PropertySet( {
      // @public
      loops: options.loops,
      radius: options.radius,
      aspectRatio: options.aspectRatio,
      pointsPerLoop: options.pointsPerLoop,
      lineWidth: options.lineWidth,
      phase: options.phase,
      deltaPhase: options.deltaPhase,
      xScale: options.xScale
    }, options );

    // Paths for the front (foreground) and back (background) parts of the spring
    var pathOptions = {
      boundsMethod: options.pathBoundsMethod,
      lineCap: 'round'
    };
    var frontPath = new Path( null, pathOptions );
    var backPath = new Path( null, pathOptions );

    // Update the line width
    this.model.lineWidthProperty.link( function( lineWidth ) {
      frontPath.lineWidth = backPath.lineWidth = lineWidth;
    } );

    // Mutate these to improve performance
    var springPoints = []; // {Vector2[]} points in the spring (includes the horizontal ends)
    var frontShape, backShape;  // {Shape}

    // Changes to these properties require new points (Vector2) and Shapes
    Property.multilink( [
        this.model.loopsProperty, this.model.pointsPerLoopProperty,
        this.model.aspectRatioProperty, this.model.phaseProperty, this.model.deltaPhaseProperty
      ],
      function( loops, pointsPerLoop, aspectRatio, phase, deltaPhase ) {

        // new points and Shapes
        springPoints.length = 0;
        frontShape = new Shape();
        backShape = new Shape();

        // Values of other properties, to improve readability
        var radius = thisNode.model.radiusProperty.get();
        var xScale = thisNode.model.xScaleProperty.get();

        // compute the points for the coil
        var coilPoints = []; // {Vector2[]}
        var numberOfCoilPoints = computeNumberOfCoilPoints( loops, pointsPerLoop );
        var index;
        for ( index = 0; index < numberOfCoilPoints; index++ ) {
          var coilX = computeCoilX( options.leftEndLength, radius, index, pointsPerLoop, phase, xScale );
          var coilY = computeCoilY( aspectRatio, radius, index, pointsPerLoop, deltaPhase, phase );
          coilPoints.push( new Vector2( coilX, coilY ) );
        }

        var p; // {Vector2} reusable point, hoisted explicitly
        var wasFront = true; // was the previous point on the front path?

        // Add points to Shapes
        for ( index = 0; index < numberOfCoilPoints; index++ ) {

          // is the current point on the front path?
          var isFront = ( ( 2 * Math.PI * index / pointsPerLoop + phase + deltaPhase ) % ( 2 * Math.PI ) > Math.PI );

          // horizontal line at left end
          if ( index === 0 ) {
            p = new Vector2(  0, coilPoints[ 0 ].y  );
            springPoints.push( p );
            if ( isFront ) {
              frontShape.moveToPoint( p );
            }
            else {
              backShape.moveToPoint( p );
            }
          }

          // coil point
          springPoints.push( coilPoints[ index ] );
          if ( isFront ) {
            // we're in the front
            if ( !wasFront && index !== 0 ) {
              // ... and we've just moved to the front
              frontShape.moveToPoint( coilPoints[ index - 1 ] );
            }
            frontShape.lineToPoint( coilPoints[ index ] );
          }
          else {
            // we're in the back
            if ( wasFront && index !== 0 ) {
              // ... and we've just moved to the back
              backShape.moveToPoint( coilPoints[ index - 1 ] );
            }
            backShape.lineToPoint( coilPoints[ index ] );
          }

          wasFront = isFront;
        }

        // horizontal line at right end
        var lastCoilPoint = coilPoints[ numberOfCoilPoints - 1 ];
        p = new Vector2(  lastCoilPoint.x + options.rightEndLength, lastCoilPoint.y  );
        springPoints.push( p );
        if ( wasFront ) {
          frontShape.lineToPoint( p );
        }
        else {
          backShape.lineToPoint( p );
        }
        assert && assert( springPoints.length === coilPoints.length + 2,
          'missing some points, have ' + springPoints.length + ', expected ' + coilPoints.length + 2 ); // +2 for horizontal ends

        frontPath.shape = frontShape;
        backPath.shape = backShape;
      } );

    // Changes to these properties can be accomplished by mutating existing points (Vector2) and Shapes
    Property.lazyMultilink( [ this.model.radiusProperty, this.model.xScaleProperty ],
      function( radius, xScale ) {

        // Values of other properties, to improve readability
        var loops = thisNode.model.loopsProperty.get();
        var pointsPerLoop = thisNode.model.pointsPerLoopProperty.get();
        var aspectRatio = thisNode.model.aspectRatioProperty.get();
        var phase = thisNode.model.phaseProperty.get();
        var deltaPhase = thisNode.model.deltaPhaseProperty.get();

        // number of points in the coil
        var numberOfCoilPoints = computeNumberOfCoilPoints( loops, pointsPerLoop );
        assert && assert( numberOfCoilPoints === springPoints.length - 2,
          'unexpected number of coil points: ' + numberOfCoilPoints + ', expected ' + ( springPoints.length - 2 ) ); // -2 for horizontal ends

        // mutate the coil points
        for ( var index = 0; index < numberOfCoilPoints; index++ ) {
          var coilX = computeCoilX( options.leftEndLength, radius, index, pointsPerLoop, phase, xScale );
          var coilY = computeCoilY( aspectRatio, radius, index, pointsPerLoop, deltaPhase, phase );
          springPoints[ index + 1 ].setXY( coilX, coilY );
        }

        // mutate the end of the rightmost horizontal wire
        var lastCoilPoint = springPoints[ springPoints.length - 2 ];
        springPoints[ springPoints.length - 1 ].setXY( lastCoilPoint.x + options.rightEndLength, lastCoilPoint.y );

        // Tell shapes that their points have changed.
        frontShape.invalidatePoints();
        backShape.invalidatePoints();
      } );

    // Update the stroke gradients
    Property.multilink( [ this.model.radiusProperty, this.model.aspectRatioProperty ],
      function( radius, aspectRatio ) {

        var yRadius = radius * aspectRatio;

        frontPath.stroke = new LinearGradient( 0, -yRadius, 0, yRadius )
          .addColorStop( 0, options.middleColor )
          .addColorStop( 0.35, options.frontColor )
          .addColorStop( 0.65, options.frontColor )
          .addColorStop( 1, options.middleColor );

        backPath.stroke = new LinearGradient( 0, -yRadius, 0, yRadius )
          .addColorStop( 0, options.middleColor )
          .addColorStop( 0.5, options.backColor )
          .addColorStop( 1, options.middleColor );
      } );

    options.children = [ backPath, frontPath ];
    Node.call( this, options );

    if ( SHOW_ORIGIN ) {
      this.addChild( new Circle( 3, { fill: 'red' } ) );
    }
  }

  var computeNumberOfCoilPoints = function( loops, pointsPerLoop ) {
    return loops * pointsPerLoop + 1;
  };

  var computeCoilX = function( leftEndLength, radius, index, pointsPerLoop, phase, xScale ) {
    return ( leftEndLength + radius ) + radius * Math.cos( 2 * Math.PI * index / pointsPerLoop + phase ) + xScale * (index / pointsPerLoop) * radius;
  };

  var computeCoilY = function( aspectRatio, radius, index, pointsPerLoop, deltaPhase, phase ) {
    return aspectRatio * radius * Math.cos( 2 * Math.PI * index / pointsPerLoop + deltaPhase + phase );
  };

  return inherit( Node, ParametricSpringNode, {

    // @public
    reset: function() {
      this.model.reset();
    }
  } );
} )
;
