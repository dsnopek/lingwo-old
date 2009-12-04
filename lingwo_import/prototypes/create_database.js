
importPackage(java.sql);

java.lang.Class.forName('org.sqlite.JDBC');
var conn = DriverManager.getConnection("jdbc:sqlite:staging.db");
var stat = conn.createStatement();
stat.executeUpdate('DROP TABLE IF EXISTS entry');
stat.executeUpdate('CREATE TABLE entry (lang, pos, headword, data)');

var prep = conn.prepareStatement("INSERT INTO entry VALUES (?, ?, ?, ?)");

prep.setString(1, 'pl');
prep.setString(2, 'noun');
prep.setString(3, 'stół');
prep.setString(4, '{}');
prep.addBatch()

prep.setString(1, 'pl');
prep.setString(2, 'adjective');
prep.setString(3, 'czerwony');
prep.setString(4, '{}');
prep.addBatch()

conn.setAutoCommit(false);
prep.executeBatch();
conn.setAutoCommit(true);

conn.close();

