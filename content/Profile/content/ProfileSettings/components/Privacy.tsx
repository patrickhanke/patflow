import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const Privacy = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.mainTitle}>
          Datenschutzerklärung für die patflow-App
        </Text>

        {/* Präambel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Präambel</Text>
          <Text style={styles.paragraph}>
            Diese App wird von Herrn Patrick Hanke, Bergmannsweg 5, 79111
            Freiburg im Breisgau (nachfolgend „wir" oder „uns") als
            Verantwortlicher zur Verfügung gestellt.
          </Text>
          <Text style={styles.paragraph}>
            Im Rahmen der App ermöglichen wir Ihnen den Abruf und Darstellungen
            folgender Informationen:
          </Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>
              • Kommentieren und Abschließen von Aufgaben
            </Text>
            <Text style={styles.bulletPoint}>
              • Erstellen und kommentieren von Tickets
            </Text>
            <Text style={styles.bulletPoint}>
              • Hinzufügen von Bildern zu Aufgaben und Tickets
            </Text>
            <Text style={styles.bulletPoint}>
              • Darstellung und Pflege von Arbeitszeit und Urlaubsdaten
            </Text>
          </View>
          <Text style={styles.paragraph}>
            Bei der Nutzung der App werden von uns personenbezogene Daten über
            Sie verarbeitet und unsere App greift auf Informationen Ihres
            Endgeräts zu. Unter personenbezogenen Daten sind sämtliche
            Informationen zu verstehen, die sich auf eine identifizierte oder
            identifizierbare natürliche Person beziehen. Weil uns der Schutz
            Ihrer Privatsphäre bei der Nutzung der App wichtig ist, möchten wir
            Sie mit den nachfolgenden Angaben darüber informieren, welche
            personenbezogenen Daten wir verarbeiten und auf welche Informationen
            Ihres Endgeräts wir zugreifen, wenn Sie die App nutzen und wie wir
            mit diesen Daten umgehen. Darüber hinaus unterrichten wir Sie über
            die Rechtsgrundlage für die Verarbeitung Ihrer Daten und, soweit die
            Verarbeitung zur Wahrung unserer berechtigten Interessen
            erforderlich ist, auch über unsere berechtigten Interessen.
          </Text>
          <Text style={styles.paragraph}>
            Sie können diese Datenschutzerklärung jederzeit unter dem
            Menüeintrag „Profil" innerhalb der App aufrufen.
          </Text>
        </View>

        {/* Section 1 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            1. Informationen zur Verarbeitung Ihrer Daten
          </Text>
          <Text style={styles.paragraph}>
            Bestimmte Informationen werden bereits automatisch verarbeitet,
            sobald Sie die App verwenden. Welche personenbezogenen Daten und
            Informationen genau verarbeitet werden, haben wir im Folgenden für
            Sie aufgeführt:
          </Text>

          <Text style={styles.subTitle}>
            1.1 Informationen, die beim Download erhoben werden
          </Text>
          <Text style={styles.paragraph}>
            Beim Download der App werden bestimmte erforderliche Informationen
            an den von Ihnen ausgewählten App Store (z.B. Google Play oder Apple
            App Store) übermittelt, insbesondere können dabei der Nutzername,
            die E-Mail-Adresse, die Kundennummer Ihres Accounts, der Zeitpunkt
            des Downloads, Zahlungsinformationen sowie die individuelle
            Gerätekennziffer verarbeitet werden. Die Verarbeitung dieser Daten
            erfolgt ausschließlich durch den jeweiligen App Store und liegt
            außerhalb unseres Einflussbereiches.
          </Text>

          <Text style={styles.subTitle}>
            1.2 Informationen, die automatisch erhoben werden
          </Text>
          <Text style={styles.paragraph}>
            Im Rahmen Ihrer Nutzung der App erheben wir bestimmte Daten
            automatisch, die für die Nutzung der App erforderlich sind. Hierzu
            gehören: Installationsdatum der App, Gerät-Identifikations-Token und
            Installations-ID. Diese Daten werden nicht gespeichert, aber
            automatisch an uns übermittelt, (1) um Ihnen den Dienst und die
            damit verbundenen Funktionen zur Verfügung zu stellen; (2) die
            Funktionen und Leistungsmerkmale der App zu verbessern und (3)
            Missbrauch sowie Fehlfunktionen vorzubeugen und zu beseitigen. Diese
            Datenverarbeitung ist dadurch gerechtfertigt, dass (1) Sie in die
            Speicherung sowie den Zugriff auf Informationen, die bereits in
            Ihrem Endgerät gespeichert sind aufgrund der bereitgestellten
            Informationen nach § 25 Abs. 1 TTDSG eingewilligt haben oder (2) der
            Zugriff auf die in der Endeinrichtung gespeicherten Informationen
            nach § 25 Abs. 2 Nr. 2 TTDSG unbedingt erforderlich ist, damit wir
            als Anbieter den von Ihnen ausdrücklich gewünschten Dienst der App
            zur Verfügung stellen können oder (3) die Verarbeitung für die
            Erfüllung des Vertrags zwischen Ihnen als Betroffener und uns gemäß
            Art. 6 Abs. 1 lit. b DSGVO zur Nutzung der App erforderlich ist,
            oder (4) wir ein berechtigtes Interesse daran haben, die
            Funktionsfähigkeit und den fehlerfreien Betrieb der App zu
            gewährleisten und einen markt- und interessengerechten Dienst
            anbieten zu können, das hier Ihre Rechte und Interessen am Schutz
            Ihrer personenbezogenen Daten im Sinne von Art. 6 Abs. 1 lit. f
            DSGVO überwiegt.
          </Text>

          <Text style={styles.subTitle}>
            1.3 Erstellung eines Nutzeraccounts (Registrierung) und Anmeldung
          </Text>
          <Text style={styles.paragraph}>
            Wenn Sie sich anmelden, verwenden wir Ihre Zugangsdaten E-Mail
            Adresse und Passwort, um Ihnen den Zugang zu Ihrem Nutzeraccount zu
            gewähren und diesen zu verwalten („Pflichtangaben"). Einen
            Nutzeraccount erhalten Sie durch uns oder einen Administrator durch
            die Zuweisung einer E-Mail Adresse sowie eines Vor- und Nachnamens.
            Die E-Mail Adresse ermöglicht den Login in die App. Im Rahmen der
            Registrierung sind die Pflichtangaben für den Abschluss des
            Nutzungsvertrages erforderlich. Wenn diese nicht angeben werden
            können, können Sie die App nicht nutzen.
          </Text>
          <Text style={styles.paragraph}>
            Darüber hinaus können Sie folgende freiwillige Angaben im Rahmen der
            Registrierung machen:
          </Text>
          <Text style={styles.paragraph}>Ein Profilbild hochladen.</Text>
          <Text style={styles.paragraph}>
            Die Pflichtangaben verwenden wir, um Sie beim Login zu
            authentifizieren und Anfragen zur Rücksetzung Ihres Passwortes
            nachzugehen. Die von Ihnen im Rahmen der Registrierung oder einer
            Anmeldung eingegebenen Daten werden von uns verarbeitet und
            verwendet, (1) um Ihre Berechtigung zur Verwaltung des
            Nutzeraccounts zu verifizieren; (2) die Nutzungsbedingungen der App
            sowie alle damit verbundenen Rechte und Pflichten durchzusetzen und
            (3) mit Ihnen in Kontakt zu treten, um Ihnen technische oder
            rechtliche Hinweise, Updates, Sicherheitsmeldungen oder andere
            Nachrichten, die etwa die Verwaltung des Nutzeraccounts betreffen,
            senden zu können.
          </Text>

          <Text style={styles.subTitle}>1.4 Nutzung der App</Text>
          <Text style={styles.paragraph}>
            Im Rahmen der App können Sie diverse Informationen, Aufgaben und
            Aktivitäten eingeben, verwalten und bearbeiten. Diese Informationen
            und Aktivitäten umfassen insbesondere Daten über die geleisteten
            Arbeitsstunden und Urlaubszeiten sowie Informationen über Aufgaben
            und Tickets, in denen arbeitsrelevante Informationen zu
            kommunikationszwecken gespeichert werden. Die App erfordert darüber
            hinaus folgende Berechtigungen:
          </Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>
              • Internetzugriff: Dieser wird benötigt, um Aufgaben und Tickets
              zu erstellen und zu kommentieren sowie Arbeits und Urlaubszeiten
              einzugeben und anzupassen.
            </Text>
            <Text style={styles.bulletPoint}>
              • Kamerazugriff: Dieser wird benötigt, damit Fotos oder Dokumente
              zu Aufgaben oder Tickets hinzufügen können.
            </Text>
          </View>

          <Text style={styles.subTitle}>
            1.5 Informationen, die auf Ihre Veranlassung gespeichert und
            verarbeitet werden
          </Text>
          <Text style={styles.paragraph}>
            Im Rahmen der Nutzung der App werden Informationen und
            personenbezogene Daten auch dann verarbeitet, wenn Sie dies im
            Rahmen der Nutzung veranlasst haben. Dies ist etwa dann der Fall,
            wenn Sie Arbeits- oder Urlaubszeiten in der App speichern, Tickets
            erstellen oder Aufgaben und Tickets kommentieren oder Bilder
            hinzufügen.
          </Text>
          <Text style={styles.paragraph}>
            Diese Informationen umfassen insbesondere folgende Daten:
          </Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>
              • Daten zu Arbeitsbeginn, Arbeitsende, Pause sowie beantragter und
              genehmigte Urlaubszeiten.
            </Text>
            <Text style={styles.bulletPoint}>
              • Informationen über erstellte Tickets (Ersteller, Zeitpunkt und
              Urheber der Erstellung, Titel, Beschreibung und ggf. Bilder)
            </Text>
            <Text style={styles.bulletPoint}>
              • Kommentare zu einer Aufgabe oder einem Ticket (Name und ggf.
              Profilbild des Kommentierenden sowie den Kommentar und ggf.
              Bilder)
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            2. Weitergabe und Übertragung von Daten
          </Text>
          <Text style={styles.paragraph}>
            Eine Weitergabe Ihrer personenbezogenen Daten ohne Ihre
            ausdrückliche vorherige Einwilligung erfolgt neben den explizit in
            dieser Datenschutzerklärung genannten Fällen lediglich dann, wenn es
            gesetzlich zulässig bzw. erforderlich ist.
          </Text>

          <Text style={styles.subTitle}>2.1 Interne Verwaltungszwecke</Text>
          <Text style={styles.paragraph}>
            Die Daten, die Sie bei der Registrierung angeben, werden innerhalb
            unseres Unternehmens für interne Verwaltungszwecke einschließlich
            der gemeinsamen Kundenbetreuung im Rahmen des Erforderlichen
            weitergeben.
          </Text>
          <Text style={styles.paragraph}>
            Eine etwaige Weitergabe der personenbezogenen Daten ist dadurch
            gerechtfertigt, dass wir ein berechtigtes Interesse daran haben, die
            Daten für administrative Zwecke innerhalb unserer Unternehmensgruppe
            weiterzugeben und Ihre Rechte und Interessen am Schutz Ihrer
            personenbezogenen Daten im Sinne von Art. 6 Abs. 1 lit. f DSGVO
            nicht überwiegen.
          </Text>

          <Text style={styles.subTitle}>2.2 Rechtliche Verpflichtungen</Text>
          <Text style={styles.paragraph}>
            Wenn es zur Aufklärung einer rechtswidrigen bzw. missbräuchlichen
            Nutzung der App oder für die Rechtsverfolgung erforderlich ist,
            werden personenbezogene Daten an die Strafverfolgungsbehörden oder
            andere Behörden sowie ggf. an geschädigte Dritte oder Rechtsberater
            weitergeleitet. Dies geschieht jedoch nur, wenn Anhaltspunkte für
            ein gesetzwidriges bzw. missbräuchliches Verhalten vorliegen. Eine
            Weitergabe kann auch stattfinden, wenn dies der Durchsetzung von
            Nutzungsbedingungen oder anderen Rechtsansprüchen dient. Wir sind
            zudem gesetzlich verpflichtet, auf Anfrage bestimmten öffentlichen
            Stellen Auskunft zu erteilen. Dies sind Strafverfolgungsbehörden,
            Behörden, die bußgeldbewährte Ordnungswidrigkeiten verfolgen, und
            die Finanzbehörden.
          </Text>
          <Text style={styles.paragraph}>
            Eine etwaige Weitergabe der personenbezogenen Daten ist dadurch
            gerechtfertigt, dass (1) auf Anordnung einer zuständigen Stelle
            Auskunft zu erteilen ist, soweit dies zur Erfüllung von
            Auskunftspflichten nach § 21 Abs. 1 und 2 TTDSG oder nach Maßgabe
            von § 22 TTDSG erforderlich ist, (2) die Verarbeitung zur Erfüllung
            einer rechtlichen Verpflichtung erforderlich ist, der wir gemäß Art.
            6 Abs. 1 lit. c DSGVO i.V.m. nationalen rechtlichen Vorgaben zur
            Weitergabe von Daten an Strafverfolgungsbehörden unterliegen, oder
            (3) wir ein berechtigtes Interesse daran haben, die Daten bei
            Vorliegen von Anhaltspunkten für missbräuchliches Verhalten oder zur
            Durchsetzung unserer Nutzungsbedingungen, anderer Bedingungen oder
            von Rechtsansprüchen an die genannten Dritten weiterzugeben und Ihre
            Rechte und Interessen am Schutz Ihrer personenbezogenen Daten im
            Sinne von Art. 6 Abs. 1 lit. f DSGVO nicht überwiegen.
          </Text>

          <Text style={styles.subTitle}>2.3 Externe Dienstleister</Text>
          <Text style={styles.paragraph}>
            Wir sind für die Erbringung unseres Dienstes auf folgende
            Fremdunternehmen und externe Dienstleister angewiesen:
          </Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>
              • Sashido, CloudStrap AD, Angel Kanchev str. 3, 1000 Sofia,
              Bulgaria
            </Text>
            <Text style={styles.bulletPoint}>
              • Bytescale, 37th Floor, 1 Canada Square, London E14 5DY, UK
            </Text>
            <Text style={styles.bulletPoint}>
              • Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, USA
            </Text>
          </View>
          <Text style={styles.paragraph}>
            Eine etwaige Weitergabe der personenbezogenen Daten ist dadurch
            gerechtfertigt, dass (1) wir ein berechtigtes Interesse daran haben,
            die Daten für administrative Zwecke innerhalb unserer
            Unternehmensgruppe weiterzugeben und Ihre Rechte und Interessen am
            Schutz Ihrer personenbezogenen Daten im Sinne von Art. 6 Abs. 1 lit.
            f DSGVO nicht überwiegen und (2) wir unsere Fremdunternehmen und
            externen Dienstleister im Rahmen von Art. 28 Abs. 1 DSGVO als
            Auftragsverarbeiter sorgfältig ausgewählt, regelmäßig überprüft und
            vertraglich verpflichtet haben, sämtliche personenbezogenen Daten
            ausschließlich entsprechend unserer Weisungen zu verarbeiten.
          </Text>
        </View>

        {/* Section 3 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            3. Datenübermittlungen in Drittländer
          </Text>
          <Text style={styles.subTitle}>
            Datenübermittlung in Drittländer mit Angemessenheitsbeschluss
          </Text>
          <Text style={styles.paragraph}>
            Wir verarbeiten Daten in Staaten außerhalb des Europäischen
            Wirtschaftsraumes („EWR"), zu denen ein Angemessenheitsbeschluss der
            Europäischen Kommission gemäß Art. 45 Abs. 1 S. 1 DSGVO existiert.
            Dies betrifft im Einzelnen:
          </Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>
              • Bytescale, 37th Floor, 1 Canada Square, London E14 5DY, UK
            </Text>
            <Text style={styles.bulletPoint}>
              • Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, USA
            </Text>
          </View>
          <Text style={styles.paragraph}>
            Durch das Vorliegen eines solchen Angemessenheitsbeschlusses hat die
            Europäische Kommission innerhalb des Drittlandes ein angemessenes
            Datenschutzniveau festgestellt.
          </Text>
        </View>

        {/* Section 4 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Zweckänderungen</Text>
          <Text style={styles.paragraph}>
            Verarbeitungen Ihrer personenbezogenen Daten zu anderen als den
            beschriebenen Zwecken erfolgen nur, soweit eine Rechtsvorschrift
            dies erlaubt oder Sie in den geänderten Zweck der Datenverarbeitung
            eingewilligt haben. Im Falle einer Weiterverarbeitung zu anderen
            Zwecken als denen, für den die Daten ursprünglich erhoben worden
            sind, informieren wir Sie vor der Weiterverarbeitung über diese
            anderen Zwecke und stellen Ihnen sämtliche weitere hierfür
            maßgeblichen Informationen zur Verfügung.
          </Text>
        </View>

        {/* Section 5 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            5. Zeitraum der Datenspeicherung
          </Text>
          <Text style={styles.paragraph}>
            Wir löschen oder anonymisieren Ihre personenbezogenen Daten, sobald
            sie für die Zwecke, für die wir sie nach den vorstehenden Ziffern
            erhoben oder verwendet haben, nicht mehr erforderlich sind. Soweit
            nicht abweichend angegeben, speichern wir Ihre personenbezogenen
            Daten für die Dauer des Nutzungs- bzw. des Vertragsverhältnisses
            über die App zzgl. eines Zeitraumes von 30 Tagen, während welchem
            wir nach der Löschung Sicherungskopien aufbewahren, soweit diese
            Daten nicht für die strafrechtliche Verfolgung oder zur Sicherung,
            Geltendmachung oder Durchsetzung von Rechtsansprüchen länger
            benötigt werden.
          </Text>
          <Text style={styles.paragraph}>
            Spezifische Angaben in dieser Datenschutzerklärung oder rechtliche
            Vorgaben zur Aufbewahrung und Löschung personenbezogener Daten,
            insbesondere solcher, die wir aus steuerrechtlichen Gründen
            aufbewahren müssen, bleiben unberührt.
          </Text>
        </View>

        {/* Section 6 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            6. Ihre Rechte als Betroffener
          </Text>

          <Text style={styles.subTitle}>6.1 Auskunftsrecht</Text>
          <Text style={styles.paragraph}>
            Sie haben das Recht, von uns jederzeit auf Antrag eine Auskunft über
            die von uns verarbeiteten, Sie betreffenden personenbezogenen Daten
            im Umfang des Art. 15 DSGVO zu erhalten. Hierzu können Sie einen
            Antrag postalisch oder per E-Mail an die unten angegebene Adresse
            stellen.
          </Text>

          <Text style={styles.subTitle}>
            6.2 Recht zur Berichtigung unrichtiger Daten
          </Text>
          <Text style={styles.paragraph}>
            Sie haben nach Art. 16 DSGVO das Recht, von uns die unverzügliche
            Berichtigung der Sie betreffenden personenbezogenen Daten zu
            verlangen, sofern diese unrichtig sein sollten. Unter
            Berücksichtigung der Zwecke der Verarbeitung haben Sie auch das
            Recht, die Vervollständigung unvollständiger personenbezogener Daten
            von uns zu verlangen. Wenden Sie sich hierfür bitte an die unten
            angegebenen Kontaktadressen.
          </Text>

          <Text style={styles.subTitle}>6.3 Recht auf Löschung</Text>
          <Text style={styles.paragraph}>
            Sie haben das Recht, unter den in Art. 17 DSGVO beschriebenen
            Voraussetzungen von uns die Löschung der Sie betreffenden
            personenbezogenen Daten zu verlangen. Diese Voraussetzungen sehen
            insbesondere ein Löschungsrecht vor, wenn die personenbezogenen
            Daten für die Zwecke, für die sie erhoben oder auf sonstige Weise
            verarbeitet wurden, nicht mehr notwendig sind, sowie in Fällen der
            unrechtmäßigen Verarbeitung, des Vorliegens eines Widerspruchs oder
            des Bestehens einer Löschungspflicht nach Unionsrecht oder dem Recht
            des Mitgliedstaates, dem wir unterliegen. Zum Zeitraum der
            Datenspeicherung siehe im Übrigen Ziffer 5 dieser
            Datenschutzerklärung. Um Ihr Recht auf Löschung geltend zu machen,
            wenden Sie sich bitte an die unten angegebenen Kontaktadressen.
          </Text>

          <Text style={styles.subTitle}>
            6.4 Recht auf Einschränkung der Verarbeitung
          </Text>
          <Text style={styles.paragraph}>
            Sie haben das Recht, von uns die Einschränkung der Verarbeitung nach
            Maßgabe des Art. 18 DSGVO zu verlangen. Dieses Recht besteht
            insbesondere, wenn die Richtigkeit der personenbezogenen Daten
            zwischen dem Nutzer und uns umstritten ist, für die Dauer, welche
            die Überprüfung der Richtigkeit erfordert, sowie im Fall, dass der
            Nutzer bei einem bestehenden Recht auf Löschung anstelle der
            Löschung eine eingeschränkte Verarbeitung verlangt; ferner für den
            Fall, dass die Daten für die von uns verfolgten Zwecke nicht länger
            erforderlich sind, der Nutzer sie jedoch zur Geltendmachung,
            Ausübung oder Verteidigung von Rechtsansprüchen benötigt sowie, wenn
            die erfolgreiche Ausübung eines Widerspruchs zwischen uns und dem
            Nutzer noch umstritten ist. Um Ihr Recht auf Einschränkung der
            Verarbeitung geltend zu machen, wenden Sie sich bitte an die unten
            angegebenen Kontaktadressen.
          </Text>

          <Text style={styles.subTitle}>
            6.5 Recht auf Datenübertragbarkeit
          </Text>
          <Text style={styles.paragraph}>
            Sie haben das Recht, von uns die Sie betreffenden personenbezogenen
            Daten, die Sie uns bereitgestellt haben, in einem strukturierten,
            gängigen, maschinenlesbaren Format nach Maßgabe des Art. 20 DSGVO zu
            erhalten. Um Ihr Recht auf Datenübertragbarkeit geltend zu machen,
            wenden Sie sich bitte an die unten angegebenen Kontaktadressen.
          </Text>
        </View>

        {/* Section 7 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Widerspruchsrecht</Text>
          <Text style={styles.paragraph}>
            Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen
            Situation ergeben, jederzeit gegen die Verarbeitung Sie betreffender
            personenbezogener Daten, die u.a. aufgrund von Art. 6 Abs. 1 lit. e
            oder lit. f DSGVO erfolgt, Widerspruch nach Art. 21 DSGVO
            einzulegen. Wir werden die Verarbeitung Ihrer personenbezogenen
            Daten einstellen, es sei denn, wir können zwingende schutzwürdige
            Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechte
            und Freiheiten überwiegen, oder wenn die Verarbeitung der
            Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen
            dient.
          </Text>
        </View>

        {/* Section 8 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Beschwerderecht</Text>
          <Text style={styles.paragraph}>
            Sie haben ferner das Recht, sich bei Beschwerden an eine
            Aufsichtsbehörde zu wenden.
          </Text>
        </View>

        {/* Section 9 - Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Kontakt</Text>
          <Text style={styles.paragraph}>
            Sollten Sie Fragen oder Anmerkungen zu unserem Umgang mit Ihren
            personenbezogenen Daten haben oder möchten Sie die unter Ziffer 6
            und 7 genannten Rechte als betroffene Person ausüben, wenden Sie
            sich bitte an:
          </Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactText}>Patrick Hanke</Text>
            <Text style={styles.contactText}>Bergmannsweg 5</Text>
            <Text style={styles.contactText}>79111 Freiburg im Breisgau</Text>
            <Text style={styles.contactText}>info@patwork.net</Text>
          </View>
        </View>

        {/* Section 10 - Changes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            10. Änderungen dieser Datenschutzerklärung
          </Text>
          <Text style={styles.paragraph}>
            Wir halten diese Datenschutzerklärung immer auf dem neuesten Stand.
            Die aktuelle Fassung der Datenschutzerklärung ist stets unter
            „Profil" innerhalb der App abrufbar.
          </Text>
          <Text style={styles.date}>Stand: Juli 2025</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  content: {
    padding: 16
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center'
  },
  section: {
    marginBottom: 32
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000'
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#222222'
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
    color: '#333333'
  },
  bulletPoints: {
    marginLeft: 8,
    marginTop: 8,
    marginBottom: 16
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
    color: '#333333'
  },
  contactInfo: {
    marginTop: 12,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8
  },
  contactText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333333'
  },
  date: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 16,
    color: '#666666'
  }
});

export default Privacy;
