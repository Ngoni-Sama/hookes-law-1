// Copyright 2002-2015, University of Colorado Boulder

/**
 * A specialization of ParametricSpringNode that adapts it to the Hooke's Law spring model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ParametricSpringNode = require( 'HOOKES_LAW/common/view/ParametricSpringNode' );

  /**
   * @param {Spring} spring
   * @param {Object} [options]
   * @constructor
   */
  function HookesLawSpringNode( spring, options ) {

    options = _.extend( {
      loops: 10, // {number} number of loops in the coil
      pointsPerLoop: 40, // {number} number of points per loop
      radius: 10, // {number} radius of a loop with aspect ratio of 1:1
      aspectRatio: 4, // {number} y:x aspect ratio of the loop radius
      unitDisplacementLength: 1, // {number} view length of 1 meter of displacement
      minLineWidth: 3, // {number} lineWidth used to stroke the spring for minimum spring constant
      deltaLineWidth: 0.005, // increase in line width per 1 unit of spring constant increase
      leftEndLength: 15, // {number} length of the horizontal line added to the left end of the coil
      rightEndLength: 25, // {number} length of the horizontal line added to the right end of the coil
      pathBoundsMethod: 'none' // {string} method used to compute bounds for scenery.Path components, see Path.boundsMethod
    }, options );

    var thisNode = this;
    ParametricSpringNode.call( this, options );

    // stretch or compress the spring
    spring.lengthProperty.link( function( length ) {
      var coilLength = ( length * options.unitDisplacementLength ) - ( options.leftEndLength + options.rightEndLength );
      var xScale = coilLength / ( thisNode.model.loopsProperty.get() * thisNode.model.radiusProperty.get() );
      thisNode.model.xScaleProperty.set( xScale );
    } );

    // spring constant determines lineWidth
    spring.springConstantProperty.link( function( springConstant ) {
      var lineWidth = options.minLineWidth + options.deltaLineWidth * ( springConstant - spring.springConstantRange.min );
      thisNode.model.lineWidthProperty.set( lineWidth );
    } );
  }

  return inherit( ParametricSpringNode, HookesLawSpringNode );
} );
