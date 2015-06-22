// Copyright 2002-2015, University of Colorado Boulder

/**
 * Bar graph representation of Energy.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var HookesLawColors = require( 'HOOKES_LAW/common/HookesLawColors' );
  var HookesLawConstants = require( 'HOOKES_LAW/common/HookesLawConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings
  var joulesString = require( 'string!HOOKES_LAW/joules' );
  var pattern_0value_1units = require( 'string!HOOKES_LAW/pattern.0value.1units' );
  var potentialEnergyString = require( 'string!HOOKES_LAW/potentialEnergy' );

  // constants
  var BAR_WIDTH = 20;

  /**
   * @param {Spring} spring
   * @param {Object} [options]
   * @constructor
   */
  function EnergyBarGraph( spring, options ) {

    options = _.extend( {
      valueVisibleProperty: new Property( true )
    }, options );

    var xAxisNode = new Line( 0, 0, 1.65 * BAR_WIDTH, 0, {
      stroke: 'black',
      lineWidth: 0.25
    } );

    var yAxisNode = new ArrowNode( 0, 0, 0, -HookesLawConstants.ENERGY_Y_AXIS_LENGTH, {
      headHeight: 10,
      headWidth: 10,
      tailWidth: 1,
      fill: 'black',
      stroke: null
    } );

    var yAxisLabel = new Text( potentialEnergyString, {
      rotation: -Math.PI / 2,
      font: HookesLawConstants.BAR_GRAPH_AXIS_FONT,
      right: yAxisNode.left - 1,
      centerY: yAxisNode.centerY,
      maxWidth: 0.85 * yAxisNode.height // constrain for i18n
    } );

    var barNode = new Rectangle( 0, 0, BAR_WIDTH, 1, {
      fill: HookesLawColors.ENERGY,
      centerX: xAxisNode.centerX
    } );

    var valueNode = new Text( '', {
      fill: HookesLawColors.ENERGY,
      font: HookesLawConstants.BAR_GRAPH_VALUE_FONT
    } );

    options.children = [ barNode, valueNode, xAxisNode, yAxisNode, yAxisLabel ];

    spring.energyProperty.link( function( energy ) {

      // resize the bar
      barNode.visible = ( energy > 0 );
      var height = Math.max( 1, energy * HookesLawConstants.UNIT_ENERGY_Y ); // bar must have non-zero size
      barNode.setRect( 0, -height, BAR_WIDTH, height ); // bar grows up

      // change the value
      valueNode.text = StringUtils.format( pattern_0value_1units, Util.toFixed( energy, HookesLawConstants.ENERGY_DECIMAL_PLACES ), joulesString );
      valueNode.left = barNode.right + 5;
      if ( !barNode.visible || barNode.height < valueNode.height / 2 ) {
        valueNode.bottom = xAxisNode.bottom;
      }
      else {
        valueNode.centerY = barNode.top;
      }
    } );

    options.valueVisibleProperty.linkAttribute( valueNode, 'visible' );

    Node.call( this, options );
  }

  return inherit( Node, EnergyBarGraph );
} );
