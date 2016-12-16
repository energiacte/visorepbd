import React from 'react';

import NavBar from 'components/NavBar';
import Footer from 'components/Footer';
import esquema_0pasos from 'img/esquema_0pasos.svg';
import esquema_1balance from 'img/esquema_1balance.svg';
import esquema_2ponderacion from 'img/esquema_2ponderacion.svg';
import esquema_3resultados from 'img/esquema_3resultados.svg';
import interfaz_general from 'img/interfaz/general.png';
import interfaz_menu from 'img/interfaz/menu.png';
import interfaz_parametrosgenerales from 'img/interfaz/parametrosgenerales.png';
import interfaz_lineasvalores from 'img/interfaz/lineasvalores.png';
import interfaz_editor from 'img/interfaz/editor.png';
import interfaz_entradavalorexpresion from 'img/interfaz/entradavalorexpresion.png';
import interfaz_comentario from 'img/interfaz/comentario.png';
import interfaz_botonera from 'img/interfaz/botonera.png';
import interfaz_indicadores from 'img/interfaz/indicadores.png';
import interfaz_factorespaso from 'img/interfaz/factorespaso.png';
import interfaz_creditos from 'img/interfaz/creditos.png';

export default React.createClass({

  render() {
    return (
      <div>
        <NavBar route={ this.props.route } />
        <div className="container">
          <div className="page-header">
            <h1>VisorEPBD</h1>

            <p className="lead"><em>VisorEPBD</em> es una aplicación web de ayuda a la <strong>evaluación de la eficiencia energética de los edificios</strong> usando el procedimiento de la norma FprEN ISO 52000-1 y destinado a la <strong>aplicación del Documento Básico de Ahorro de Energía</strong> (DB-HE) del <strong>Código Técnico de la Edificación</strong> (CTE).</p>

            <p>La aplicación <a href="https://github.com/energiacte/epbdcalc">EPBDcalc</a> proporciona una implementación alternativa del procedimiento para su uso desde la consola.</p>
          </div>
          {/* <div className="row">
          <h2>Indice</h2>
          </div> */}

          <div className="row">
            <h2>Interfaz de la herramienta <i>VisorEPBD</i></h2>

            <h3>Organización general</h3>

            <p>La pantalla de la aplicación se organiza mediante un menú y un espacio que se modifica en función de la sección que se encuentre activada.</p>
            <p>En la imagen siguiente se muestra la sección principal o de <i>Inicio</i>.</p>

            <img className="img-responsive col-md-offset-2" width="60%" src={ interfaz_general } />

            <h3>Menú de navegación</h3>

            <p>El menú permite cambiar la sección sobre la que se trabaja, pudiendo activarse las secciones de <i>Inicio</i>, <i>Factores de paso</i>, <i>Ayuda</i> y <i>Créditos</i>.</p>

            <p><img className="img-responsive col-md-offset-2" width="60%" src={ interfaz_menu } /></p>

            <h3>Sección <i>Inicio</i></h3>

            <p>Esta es la sección principal de trabajo, en la que se opera con los datos de entrada y los parámetros generales, a excepción de los factores de paso, que disponen de una sección propia.</p>

            <h4>Parámetros generales</h4>

            <p>Esta pestaña permite definir y modificar los parámetros generales de cálculo, tanto el <b>factor de exportación</b> (<b>k<sub>exp</sub></b>), como el <b>factor de resuministro</b> (<b>k<sub>exp</sub></b>) y el <b>área de referencia</b>.</p>

            <img className="img-responsive col-md-offset-2" width="60%" src={ interfaz_parametrosgenerales } />

            <h4>Líneas de valores energéticos</h4>

            <p>Esta lista muestra información sobre las <b>líneas de valores</b> de consumo y producción <i>in situ</i> del edificio (expresadas en términos de energía final) sobre las que se realizarán los cálculos. Permite también seleccionar la línea activa para su modificación en el editor.</p>

            <p>Cada línea dispone de las siguientes columnas:</p>

            <ul>
              <li>Activación: permite activar o desactivar la línea en el cálculo</li>
              <li>Tipo: define si se trata de una línea de valores de tipo <tt>CONSUMO</tt> o <tt>PRODUCCION</tt></li>
              <li>Origen/Uso: define el origen de la energía producida o el uso de la energía consumida</li>
              <li>kWh/año: muestra la suma de todos los valores de la línea</li>
              <li>kWh/año/m2: muestra la suma de todos los valores de la línea repercutida por el área de referencia</li>
              <li>Valores: muestra un histograma con los valores de la línea (a lo largo del periodo de cálculo)</li>
              <li>Comentario: muestra un comentario descriptivo de la línea.</li>
            </ul>

            <img className="img-responsive col-md-offset-2" width="60%" src={ interfaz_lineasvalores } />

            <p>Las líneas de tipo <tt>CONSUMO</tt> se muestran en color azul y las de tipo <tt>PRODUCCION</tt> en color negro.</p>

            <h4>Editor de la línea de valores seleccionada</h4>

            <p>El panel de edición permite modificar los datos de la línea de valores actualmente seleccionada.</p>

            <p>Se pueden cambiar el <b>tipo</b> de valores (<tt>CONSUMO</tt> o <tt>PRODUCCION</tt>), el <b>origen</b> (<tt>COGENERACION</tt> o <tt>INSITU</tt>, para líneas de tipo <tt>PRODUCCION</tt>) o <b>uso</b> (<tt>EPB</tt> o <tt>NEPB</tt>, para líneas de tipo <tt>CONSUMO</tt>) y el <b>vector</b> energético.</p>

            <p>El desplegable <b>Curva</b> permite modificar la forma de la línea de valores (que se ve a su derecha), manteniendo la forma actual o estableciendo una forma distinta (constante, creciente, decreciente, cóncava, convexa), manteniendo el valor agregado de la línea.</p>

            <p><img className="img-responsive col-md-offset-2" width="60%" src={ interfaz_editor } /></p>

            <p className="well alert-info">El interés de este apartado es exploratorio, al permitir modificar los datos de entrada.</p>

            <p>La entrada de Energía total permite escalar los valores de la línea (manteniendo la forma) moviendo el deslizador lateral, introduciendo un valor o una expresión matemática simple (+-*/), debiendo presionar la tecla ENTER para aceptar el valor introducido.</p>

            <p><img className="img-responsive col-md-offset-2" width="60%" src={ interfaz_entradavalorexpresion } /></p>

            <p>La casilla de entrada de comentario permite introducir o modificar un comentario descriptivo de la línea de valores.</p>

            <p><img className="img-responsive col-md-offset-2" width="60%" src={ interfaz_comentario } /></p>

            <h4>Diagrama de indicadores</h4>

            <img className="img-responsive col-md-offset-2" width="60%" src={ interfaz_indicadores } />

            <h3>Sección <i>Factores de paso</i></h3>

            <p>En esta sección se muestran los factores de paso usados en el cálculo, y se permite la edición de los factores de paso configurables por el usuario.</p>

            <img className="img-responsive col-md-offset-2" width="60%" src={ interfaz_factorespaso } />

            <h3>Sección <i>Ayuda</i></h3>

            <p>Contiene esta información de ayuda sobre el funcionamiento del programa y su proceso de cálculo.</p>

            <h3>Sección <i>Créditos</i></h3>

            <p>En esta sección se muestran los créditos del programa y la licencia con la que se distribuye.</p>

            <img className="img-responsive col-md-offset-2" width="60%" src={ interfaz_creditos } />
          </div>

          <hr />

          <div className="row">
            <h2>Evaluación de la eficiencia energética con VisorEPBD</h2>

            <h3>Etapas de evaluación de la eficiencia energética</h3>

            <p><i>VisorEPBD</i> se basa en el procedimiento de evaluación de la eficiencia energética detallado en la norma <i>FprEN ISO 52000-1</i> para la obtención de indicadores de eficiencia energética.</p>

            <div className="well alert-info">
              <p>La futura norma <a href="https://standards.cen.eu/dyn/www/f?p=204:110:0::::FSP_PROJECT,FSP_LANG_ID:39126,25&cs=19F7F3818E534259C716B5367760F1291">FprEN ISO 52000-1</a> (ISO/FDIS 52000-1:2016) está en fase de aprobación y posiblemente será aprobada en el año 2017. Su contenido, en relación al cálculo de los balances energéticos, es sustancialmente igual al de la vigente <a href="https://standards.cen.eu/dyn/www/f?p=204:110:0::::FSP_PROJECT:27654&cs=1AF4D76BF8CF676FF1309B6875F21B1EB">EN 15603:2008</a> (y su propuesta de actualización EN 15603:2014).</p>
            </div>

            <p>El procedimiento parte de la <b>energía consumida</b> y la <b>energía producida <i>in situ</i></b>, define los balances energéticos e indicadores de eficiencia, además de describir otras salidas de resultados.</p>

            <p>Los pasos del procedimiento de evaluación son los siguientes:</p>

            <ol style={ {listStyleType: 'lower-alpha'} }>
              <li>Definición de las cargas internas y condiciones operacionales del edificio y sus espacios;</li>
              <li>Definición de las cargas externas (clima) del edificio;</li>
              <li>Zonificación del edificio;</li>
              <li>Cálculo de las <strong>necesidades de energía final</strong> de los servicios en cada intervalo de cálculo, considerando la energía auxiliar, la <strong>contribución de las fuentes de energía renovables</strong> y la pérdidas térmicas recuperables;</li>
              <li>Consideración de las interacciones entre procesos (repetición o iteración);</li>
              <li>Cálculo de la <strong>producción <em>in situ</em> de electricidad</strong> (con paneles fotovoltaicos, cogeneración u otros sistemas);</li>
              <li style={ {color: 'navy'} }>Cálculo de la <b>composición de la energía suministrada y exportada</b> en cada intervalo de cálculo;</li>
              <li style={ {color: 'navy'} }><b>Ponderación de la energía suministrada y exportada</b> (como energía primaria o emisiones) en cada intervalo de cálculo, teniendo en cuenta o no la inclusión de la energía exportada en la evaluación del rendimiento energético del edificio;</li>
              <li style={ {color: 'navy'} }><b>Agregación de los resultados</b> a lo largo del periodo de cálculo y obtención de los <b>indicadores de eficiencia energética</b>;</li>
              <li>Obtención de la energía suministrada o ponderada por servicio o parte del edificio;</li>
              <li>Obtención de indicadores parciales de rendimiento (eficiencias de subsistemas, factores de carga, etc);</li>
              <li>Elaboración de informes de cálculo.</li>
            </ol>

            <p>De forma general, dicho procedimiento se puede estructurar en tres fases:</p>

            <ol>
              <li><b>Obtención de datos de entrada</b> (pasos <i>a</i> a <i>f</i>): a partir de modelización energética con procedimientos de simulación o de mediciones</li>
              <li style={ {color: 'navy'} }><b>Cálculo de la eficiencia energética y de los indicadores</b> (pasos <i>g</i> a <i>i</i>): esta es la etapa que resuelve <i>VisorEPBD</i></li>
              <li><b>Elaboración de los resultados</b> (pasos <i>j</i> a <l>l</l>): para la comunicación de resultados, incluyendo indicadores globales o parciales.</li>
            </ol>

            <h3>Proceso de cálculo del <i>VisorEPBD</i></h3>

            <h4>Entradas externas</h4>

            <p>VisorEPBD se alimenta de entradas externas que consisten en:</p>

            <ul>
              <li><strong>Parámetros generales</strong> (factores de resuministro y exportación, factores de paso);</li>
              <li>Valores de <strong>consumo</strong> y <strong>producción</strong> de <strong>energía final</strong> en cada intervalo de cálculo, por vector energético, obtenidos mediante procedimientos de simulación energético o de mediciones.</li>
            </ul>

            <div className="well alert-info">
              <p><b>IMPORTANTE</b>: Cuando se desee realizar una evaluación reglamentaria los parámetros generales vendrán fijados por documentos reglamentarios (<i>CTE DB-HE</i>, <i>Certificación energética</i>), y las condiciones de simulación o de obtención de los datos de consumo y producción serán obtenidos en las condiciones que fijen dichos documentos.</p>
              <p>En el contexto reglamentario del <i>CTE DB-HE</i> solamente se consideran los consumos de los siguientes usos (EPB): <i>calefacción, refrigeración, ventilación, ACS y, en uso terciario, iluminación</i>, y la producción de energía <i>in situ</i>.</p>
              <p>Los factores de paso oficiales pueden consultarse en el Documento reconocido del RITE <a href="http://www.minetad.gob.es/energia/desarrollo/EficienciaEnergetica/RITE/Reconocidos/Reconocidos/Otros%20documentos/Factores_emision_CO2.pdf">Factores de emisión de CO2 y coeficientes de paso a energía primaria de diferentes fuentes de energía final consumidas en el sector de edificios en España</a> incluye los factores de paso de energía final a energía primaria y emisiones.</p>
            </div>

            <h4>Etapas del proceso</h4>

            <p>Una vez realizada la entrada de datos, <i>VisorEPBD</i> realiza un proceso interno de cálculo que consta de las siguientes etapas:</p>

            <img className="img-responsive col-md-offset-2" src={ esquema_0pasos } />

            <h4>Cálculo del balance de energía final suministrada y exportada</h4>

            <p>En esta etapa se obtiene, a partir de los datos de energía final consumida y producida <i>in situ</i> en cada intervalo de cálculo, un balance de la energía suministrada (por las redes de suministro o el medioambiente) al edificio (energía importada al edificio) y la energía exportada por el edificio en cada intervalo de cálculo.</p>

            <p>Un parámetro global que influye en este balance, es el <b>factor de resuministro</b>, <b>k<sub>rdel</sub></b>, que controla qué fracción de la energía producida y no consumida (exportada) en otros intervalos de tiempo puede resuministrarse al edificio, siendo la restante finalmente exportada a la red.</p>

            <div className="well alert-info">
              <p>El <b>intervalo de cálculo</b> determina la granularidad de los datos de entrada (p.e. mensual) para el proceso de evaluación de la eficiencia energética y no necesariamente se correponde con la que se ha empleado para su obtención o para la simulación energética (p.e. horaria).</p>
            </div>

            <img className="img-responsive col-md-offset-2" src={ esquema_1balance } />

            <h4>Ponderación de la energía suministrada y exportada</h4>

            <p>En esta etapa se convierte, mediante la ponderación, la energía final a <b>energía primaria</b>, emisiones, costes, etc, para cada intervalo de cálculo.</p>

            <p>La energía exportada se pondera de dos modos, uno que tiene en cuenta los recursos utilizados para generarla (<a>paso A</a>) y otro que incluye también el impacto de la exportación de dicha energía, como recursos evitados a la red (<b>paso B</b>).</p>

            <p>En la consideración del <i>paso B</i> interviene otro parámetro global, el <b>factor de exportación</b>, <b>k<sub>exp</sub></b>, que determina qué fracción de la energía finalmente exportada es considerada al evaluar el impacto en la red.</p>

            <img className="img-responsive col-md-offset-2" src={ esquema_2ponderacion } />

            <div className="well alert-info">
              <p>En el contexto reglamentario del <i>CTE DB-HE</i> la ponderación utilizada está orientada a la obtención de <b>energía primaria</b> y, en la <i>Certificación energética</i>, también de las <b>emisiones de CO<sub>2e</sub></b>.</p>

              <p>En el caso en el que el factor de exportación, <i>k<sub>exp</sub></i>, sea igual a cero, los pasos A y B coinciden.</p>
            </div>

            <h4>Agregación y obtención de indicadores</h4>

            <p>La eficiencia energética se define como la diferencia entre la energía importada y la exportada por el sistema, realizándose el balance también considerando dos pasos de cálculo, el <i>paso A</i> y el <i>paso B</i> según se tenga en cuenta o no en la evaluación energética del edificio el impacto de su energía exportada en la red.</p>

            <p>Los indicadores (como el consumo de energía primaria) pueden, a su vez, descomponerse en la fracción procedente de fuentes renovables y la procedente de fuentes no renovables.</p>

            <img className="img-responsive col-md-offset-2" src={ esquema_3resultados } />
          </div>

          <hr />

          <div className="row">
            <h2>Uso de <i>VisorEPBD</i> como ayuda al diseño</h2>
            <h3>Predimensionado</h3>
            <p><i>VisorEPBD</i> puede usarse como ayda al diseño partiendo de las demandas energéticas, pudiendo observar el efecto de la introducción de:</p>
            <ul>
              <li>distintos sistemas</li>
              <li>cambio de vector energético</li>
              <li>producción de energía renovable</li>
            </ul>
            <h3>Introducción de sistemas</h3>

            <h4>Sistemas de un único vector energético</h4>
            <h4>Sistemas con aportación del medioambiente (bombas de calor)</h4>
            <h4>Sistemas de cogeneración</h4>
            <h4>Producción de energía in situ (térmica y eléctrica)</h4>

            <h3>Estimación de la composición de la energía final</h3>

            <h4>Obtención de la energía final a partir de la demanda</h4>

            Demanda
            Rendimiento
            <ul>
              <li>Rendimiento en generación</li>
              <li>Rendimiento en distribución</li>
              <li>Rendimiento en emisión y control</li>
            </ul>

            <h3>Ejemplos</h3>
            <h4>Caldera de gas natural</h4>
            <h4>Bomba de calor</h4>
            <h4>Cogeneración</h4>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
});
