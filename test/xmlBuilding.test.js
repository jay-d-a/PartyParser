const { xmlParser } = require("../index");

test('Builder: open tag with no value or child', () => {
    var xml = new xmlParser();
    xml.open('root');
    expect(xml.build()).toBe("<root/>");
});

test('Builder: open tag with attributes and value', () => {
    var xml = new xmlParser();
    xml.open('root', {'name': 'james', 'age':'9'}, 'value');
    expect(xml.build()).toBe('<root name="james" age="9">value</root>')
});

test('Builder: open tag with value (same method)', () => {
    var xml = new xmlParser();
    xml.open('root', 'value');
    expect(xml.build()).toBe('<root>value</root>')
});

test('Builder: open tag with value', () => {
    var xml = new xmlParser();
    xml.open('root');
    xml.addValue('Root Value');
    expect(xml.build()).toBe("<root>Root Value</root>");
});

test('Builder: open tag with child', () => {
    var xml = new xmlParser();
    xml.open('root');
    xml.add('child');
    expect(xml.build()).toBe("<root>\n\t<child/>\n</root>");
});

test('Builder: open tag with value and child', () => {
    var xml = new xmlParser();
    xml.open('root');
    xml.add('child');
    xml.addValue('value');
    expect(xml.build()).toBe("<root>value\n\t<child/>\n</root>");
});

test('Builder: add tag with attributes, no value', () => {
    var xml = new xmlParser();
    xml.open('root');
    xml.add('child', {'name': 'james', 'age':'9'});
    expect(xml.build()).toBe("<root>\n\t<child name=\"james\" age=\"9\"/>\n</root>");
});

test('Builder: add tag with attributes and value', () => {
    var xml = new xmlParser();
    xml.open('root');
    xml.add('child', {'name': 'james', 'age':'9'}, "value");
    expect(xml.build()).toBe("<root>\n\t<child name=\"james\" age=\"9\">value</child>\n</root>");
});

test('Builder: add tag with value', () => {
    var xml = new xmlParser();
    xml.open('root');
    xml.add('child', "value");
    expect(xml.build()).toBe("<root>\n\t<child>value</child>\n</root>");
});

test('Builder: closing open tag will make next open/add a sibling not child', () => {
    var xml = new xmlParser();
    xml.open('root');
    xml.add('child', "value");
    xml.close('root');
    xml.open('sibling');
    xml.add('child', 'value');
    expect(xml.build()).toBe("<root>\n\t<child>value</child>\n</root>\n<sibling>\n\t<child>value</child>\n</sibling>");
});

test('Builder: add value should add to the value', () => {
    var xml = new xmlParser();
    xml.open('root');
    xml.add('child');
    xml.addValue('value');
    xml.addValue(' and new value');
    expect(xml.build()).toBe("<root>value and new value\n\t<child/>\n</root>");
});

test('Builder: set value should replace the value', () => {
    var xml = new xmlParser();
    xml.open('root');
    xml.add('child');
    xml.addValue('value');
    xml.setValue('new value');
    expect(xml.build()).toBe("<root>new value\n\t<child/>\n</root>");
});

test('Builder: attribute will add an attribute', () => {
    var xml = new xmlParser();
    xml.open('root');
    xml.attribute('name', 'james');
    xml.add('child');
    expect(xml.build()).toBe('<root name="james">\n\t<child/>\n</root>');
});

test('Builder: attributes will add attributes', () => {
    var xml = new xmlParser();
    xml.open('root');
    xml.attributes({'name': 'james', 'age': 9});
    xml.add('child');
    expect(xml.build()).toBe('<root name="james" age="9">\n\t<child/>\n</root>');
});

test('Builder: remove attribute will remove an attribute', () => {
    var xml = new xmlParser();
    xml.open('root');
    xml.attribute('name', 'james');
    xml.removeAttribute('name');
    xml.add('child');
    expect(xml.build()).toBe('<root>\n\t<child/>\n</root>');
});

var xmlExample = `<?xml version="1.0" encoding="UTF-8" ?>
<root>
  <climate>-926247724</climate>
  <giant>
    <!--foot-->
    <spell upper="fall">1147665599.4171147</spell>
    <rest>1974258954
      <!--everybody television indeed different sugar fastened-->
    </rest>
    <suppose>-1248232111</suppose>
    <boat make="fine">common</boat>
    <children>underline</children>
    <underline>
      <tip>-1924087825.2440643</tip>
      <influence>2146446204</influence>
      <dish>-151104681.11050797</dish>
      <!--whose flow protection modern lead although-->
      <exercise blank="remarkable">1284208529.4736962</exercise>
      <one tip="forward">
        <unusual>
          <command trade="nine">369448345</command>
          <herself pet="cattle">
            <species>18156235</species>
            <!--harder happen speed lose proud-->
            <house nearest="influence">remarkable</house>
            <scientific>
              <brave>gain</brave>
              <specific>
                <unit rabbit="flag">obtain</unit>
                <clear>751921715.6689124</clear>
                <newspaper>132338491.22253084</newspaper>
                <percent>237532963.8817625</percent>
                <refused>
                  <solve chemical="boy">
                    <law giving="serve">ahead</law>
                    <keep cabin="route">heavy</keep>
                    <in rain="environment">1222757098.5845757</in>
                    <official>
                      <!--asleep alike eventually fresh tax let compass rich future power fruit mathematics-->-1981450567.5371637
                    </official>
                    <show>pie</show>
                    <steady>oldest
                      <!--desk club-->
                    </steady>
                    <!--hearing gun-->
                    <chance atomic="improve">-573449458.733119</chance>
                    <!--locate individual week are-->
                    <roar>-1785017246</roar>
                    <flies greatly="television">month</flies>
                    <brain spread="cookies">-1173079014</brain>
                    <sun>find</sun>
                    <queen ancient="term">-1450788814</queen>
                  </solve>
                  <felt sail="power">-1850837673</felt>
                  <danger whole="medicine">corner</danger>
                  <consonant motor="ball">673844492.5693884</consonant>
                  <call>-1228939289.5208025</call>
                  <step>camera
                    <!--creature serious known-->
                  </step>
                  <method size="road">-1240151100.4862065</method>
                  <steam camp="railroad">alphabet</steam>
                  <!--got silk because chair sense damage-->
                  <flat>load</flat>
                  <or older="making">found</or>
                  <movement>
                    <!--talk-->402230555.30635405
                  </movement>
                  <compare>-1459725394.605672</compare>
                </refused>
                <sell>ear</sell>
                <machinery fur="tongue">2021496803.8555365</machinery>
                <strange cloud="duty">
                  <!--welcome worried harder unhappy directly dry fly blanket-->-578030602
                </strange>
                <unhappy softly="meet">helpful</unhappy>
                <promised solution="mix">672572565</promised>
                <religious>chemical</religious>
                <person>written</person>
              </specific>
              <dozen>-329630557</dozen>
              <hundred>water</hundred>
              <number fruit="condition">glass</number>
              <!--belong trace born increase unit therefore creature different-->
              <pick chance="whispered">-465616684</pick>
              <grandfather table="garden">521498674.33887625</grandfather>
              <colony thee="met">apart</colony>
              <tin>asleep</tin>
              <green>832370048</green>
              <ground>
                <!--favorite hidden bad whale-->-1567134258.9967055
              </ground>
              <difficulty scientific="actually">list</difficulty>
            </scientific>
            <meet grew="careful">office</meet>
            <studied leg="case">same</studied>
            <gun smile="involved">1119709439.021459</gun>
            <honor exercise="bound">700546462</honor>
            <yourself tent="per">1985538817</yourself>
            <familiar>headed</familiar>
            <!--perfectly-->
            <pitch>1659321950</pitch>
            <entire using="saddle">-911501912</entire>
            <pick>-2121958294</pick>
          </herself>
          <applied>give</applied>
          <!--floating-->
          <medicine pony="tried">laid</medicine>
          <village lost="evidence">harder
            <!--husband near ship read report mathematics white struck underline-->
          </village>
          <drew thank="nice">struggle</drew>
          <worry>-1285115827</worry>
          <post>sang</post>
          <thousand test="local">1928203417.352961</thousand>
          <!--western doll audience blood no-->
          <interior including="whispered">-1633858076.346776</interior>
          <famous>1177784079</famous>
          <heard>prepare</heard>
        </unusual>
        <flies>1782244525.0757403</flies>
        <string>-1322136541</string>
        <brought>-696693769</brought>
        <function>
          <!--value war certainly catch put-->speak
        </function>
        <except>366744166.7728472
          <!--bare-->
        </except>
        <active>-198004539</active>
        <anyway>
          <!--battle couple-->1596134951
        </anyway>
        <coach audience="shorter">needed
          <!--prepare bite tie attack brush-->
        </coach>
        <!--blue similar-->
        <system agree="actual">mix</system>
        <smallest>-2098428984.092721</smallest>
        <mill>world
          <!--respect-->
        </mill>
      </one>
      <thin>easily</thin>
      <such operation="pride">-1816323031</such>
      <!--package explore view-->
      <word>rate</word>
      <tone three="voyage">dangerous</tone>
      <since find="key">pot</since>
      <zero>
        <!--himself additional thank drew former death observe disease children-->getting
      </zero>
      <wealth feet="friendly">1227305318</wealth>
    </underline>
    <shine>smallest</shine>
    <arrangement>luck</arrangement>
    <bit>475391441</bit>
    <repeat log="seen">-152269905</repeat>
    <globe>cross</globe>
    <!--series band condition decide condition-->
    <nose>-1818669522</nose>
  </giant>
  <larger>-1691757709</larger>
  <union>aware
    <!--wrote-->
  </union>
  <rise forty="statement">-782334305</rise>
  <cutting even="sleep">golden</cutting>
  <!--wrote-->
  <party location="ahead">-2006519948</party>
  <leaf>shoulder</leaf>
  <!--private load-->
  <cent western="magnet">ordinary</cent>
  <till>am</till>
  <describe mirror="sheep">-328771659</describe>
  <chamber>-1349042115</chamber>
</root>`;

var expectedAfterParse = `<?xml version="1.0" encoding="UTF-8"?>
<root>
	<climate>-926247724</climate>
	<giant>
		<spell upper="fall">1147665599.4171147</spell>
		<rest>1974258954</rest>
		<suppose>-1248232111</suppose>
		<boat make="fine">common</boat>
		<children>underline</children>
		<underline>
			<tip>-1924087825.2440643</tip>
			<influence>2146446204</influence>
			<dish>-151104681.11050797</dish>
			<exercise blank="remarkable">1284208529.4736962</exercise>
			<one tip="forward">
				<unusual>
					<command trade="nine">369448345</command>
					<herself pet="cattle">
						<species>18156235</species>
						<house nearest="influence">remarkable</house>
						<scientific>
							<brave>gain</brave>
							<specific>
								<unit rabbit="flag">obtain</unit>
								<clear>751921715.6689124</clear>
								<newspaper>132338491.22253084</newspaper>
								<percent>237532963.8817625</percent>
								<refused>
									<solve chemical="boy">
										<law giving="serve">ahead</law>
										<keep cabin="route">heavy</keep>
										<in rain="environment">1222757098.5845757</in>
										<official>-1981450567.5371637</official>
										<show>pie</show>
										<steady>oldest</steady>
										<chance atomic="improve">-573449458.733119</chance>
										<roar>-1785017246</roar>
										<flies greatly="television">month</flies>
										<brain spread="cookies">-1173079014</brain>
										<sun>find</sun>
										<queen ancient="term">-1450788814</queen>
									</solve>
									<felt sail="power">-1850837673</felt>
									<danger whole="medicine">corner</danger>
									<consonant motor="ball">673844492.5693884</consonant>
									<call>-1228939289.5208025</call>
									<step>camera</step>
									<method size="road">-1240151100.4862065</method>
									<steam camp="railroad">alphabet</steam>
									<flat>load</flat>
									<or older="making">found</or>
									<movement>402230555.30635405</movement>
									<compare>-1459725394.605672</compare>
								</refused>
								<sell>ear</sell>
								<machinery fur="tongue">2021496803.8555365</machinery>
								<strange cloud="duty">-578030602</strange>
								<unhappy softly="meet">helpful</unhappy>
								<promised solution="mix">672572565</promised>
								<religious>chemical</religious>
								<person>written</person>
							</specific>
							<dozen>-329630557</dozen>
							<hundred>water</hundred>
							<number fruit="condition">glass</number>
							<pick chance="whispered">-465616684</pick>
							<grandfather table="garden">521498674.33887625</grandfather>
							<colony thee="met">apart</colony>
							<tin>asleep</tin>
							<green>832370048</green>
							<ground>-1567134258.9967055</ground>
							<difficulty scientific="actually">list</difficulty>
						</scientific>
						<meet grew="careful">office</meet>
						<studied leg="case">same</studied>
						<gun smile="involved">1119709439.021459</gun>
						<honor exercise="bound">700546462</honor>
						<yourself tent="per">1985538817</yourself>
						<familiar>headed</familiar>
						<pitch>1659321950</pitch>
						<entire using="saddle">-911501912</entire>
						<pick>-2121958294</pick>
					</herself>
					<applied>give</applied>
					<medicine pony="tried">laid</medicine>
					<village lost="evidence">harder</village>
					<drew thank="nice">struggle</drew>
					<worry>-1285115827</worry>
					<post>sang</post>
					<thousand test="local">1928203417.352961</thousand>
					<interior including="whispered">-1633858076.346776</interior>
					<famous>1177784079</famous>
					<heard>prepare</heard>
				</unusual>
				<flies>1782244525.0757403</flies>
				<string>-1322136541</string>
				<brought>-696693769</brought>
				<function>speak</function>
				<except>366744166.7728472</except>
				<active>-198004539</active>
				<anyway>1596134951</anyway>
				<coach audience="shorter">needed</coach>
				<system agree="actual">mix</system>
				<smallest>-2098428984.092721</smallest>
				<mill>world</mill>
			</one>
			<thin>easily</thin>
			<such operation="pride">-1816323031</such>
			<word>rate</word>
			<tone three="voyage">dangerous</tone>
			<since find="key">pot</since>
			<zero>getting</zero>
			<wealth feet="friendly">1227305318</wealth>
		</underline>
		<shine>smallest</shine>
		<arrangement>luck</arrangement>
		<bit>475391441</bit>
		<repeat log="seen">-152269905</repeat>
		<globe>cross</globe>
		<nose>-1818669522</nose>
	</giant>
	<larger>-1691757709</larger>
	<union>aware</union>
	<rise forty="statement">-782334305</rise>
	<cutting even="sleep">golden</cutting>
	<party location="ahead">-2006519948</party>
	<leaf>shoulder</leaf>
	<cent western="magnet">ordinary</cent>
	<till>am</till>
	<describe mirror="sheep">-328771659</describe>
	<chamber>-1349042115</chamber>
</root>`;

test('Builder: parsing xml and the rebuilding', () => {
    var xml = new xmlParser(xmlExample);
    xml.parse();
    expect(xml.build()).toBe(expectedAfterParse);
});