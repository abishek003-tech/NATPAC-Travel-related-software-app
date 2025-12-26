import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider with ChangeNotifier {
  String? _authType;
  String? _username;
  String? _userEmail;

  String? get authType => _authType;
  String? get username => _username;
  String? get userEmail => _userEmail;

  bool get isAuthenticated => _authType != null;
  bool get isUser => _authType == 'user';
  bool get isAdmin => _authType == 'admin';

  Future<void> loadAuthState() async {
    final prefs = await SharedPreferences.getInstance();
    _authType = prefs.getString('authType');
    _username = prefs.getString('username');
    _userEmail = prefs.getString('userEmail');
    notifyListeners();
  }

  Future<void> loginUser(String username, {String? email}) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('authType', 'user');
    await prefs.setString('username', username);
    if (email != null) {
      await prefs.setString('userEmail', email);
    }
    
    _authType = 'user';
    _username = username;
    _userEmail = email;
    notifyListeners();
  }

  Future<void> loginAdmin(String username) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('authType', 'admin');
    await prefs.setString('username', username);
    
    _authType = 'admin';
    _username = username;
    notifyListeners();
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    
    _authType = null;
    _username = null;
    _userEmail = null;
    notifyListeners();
  }
}
