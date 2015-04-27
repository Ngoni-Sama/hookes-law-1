// Copyright 2002-2015, University of Colorado Boulder

/**
 * Constants for this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HookesLawFont = require( 'HOOKES_LAW/common/HookesLawFont' );

  return {
    SCREEN_VIEW_OPTIONS: { layoutBounds: new Bounds2( 0, 0, 1024, 618 ) },

    APPLIED_FORCE_DECIMAL_PLACES: 0,
    APPLIED_FORCE_DELTA: 1,
    SPRING_FORCE_DECIMAL_PLACES: 0,
    SPRING_FORCE_DELTA: 10,
    DISPLACEMENT_DECIMAL_PLACES: 3,
    DISPLACEMENT_DELTA: 0.001,

    UNIT_FORCE_VECTOR_LENGTH: 1.75,  // view length of a force vector whose magnitude is 1 N
    UNIT_DISPLACEMENT_VECTOR_LENGTH: 200, // view length of a displacement vector whose magnitude is 1 m
    CONTROL_PANEL_TITLE_FONT: new HookesLawFont( 18 ),
    SLIDER_TICK_LABEL_FONT: new HookesLawFont( 14 ),
    SLIDER_THUMB_SIZE: new Dimension2( 17, 34 ),
    SLIDER_TRACK_SIZE: new Dimension2( 180, 3 ),
    SLIDER_MAJOR_TICK_LENGTH: 20
  };
} );
