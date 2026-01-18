'use strict';

const {Adw, Gio, Gtk} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init() {

}

function fillPreferencesWindow(window) {
    // Use the same GSettings schema as in `extension.js`
    const settings = ExtensionUtils.getSettings(
        'org.gnome.shell.extensions.openai');

    // Create a preferences page and group
    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup();
    page.add(group);


    const openaiApiUrlRow = new Adw.ActionRow({title: 'openai-api-url'});
    group.add(openaiApiUrlRow);

    const openaiApiUrl = new Gtk.Entry({
        hexpand: true
    });

    openaiApiUrl.text = settings.get_string("openai-api-url");

    settings.bind("openai-api-url", openaiApiUrl, 'text', Gio.SettingsBindFlags.DEFAULT);

    openaiApiUrlRow.add_suffix(openaiApiUrl);
    openaiApiUrlRow.activatable_widget = openaiApiUrl;


    const openaiModelRow = new Adw.ActionRow({title: 'openai-model'});
    group.add(openaiModelRow);

    const openaiModel = new Gtk.Entry({
        hexpand: true
    });

    openaiModel.text = settings.get_string("openai-model");

    settings.bind("openai-model", openaiModel, 'text', Gio.SettingsBindFlags.DEFAULT);

    openaiModelRow.add_suffix(openaiModel);
    openaiModelRow.activatable_widget = openaiModel;


    const openaiApiKeyRow = new Adw.ActionRow({title: 'openai-api-key'});
    group.add(openaiApiKeyRow);

    const openaiApiKey = new Gtk.Entry({
        hexpand: true
    });

    openaiApiKey.text = settings.get_string("openai-api-key");

    settings.bind("openai-api-key", openaiApiKey, 'text', Gio.SettingsBindFlags.DEFAULT);

    openaiApiKeyRow.add_suffix(openaiApiKey);
    openaiApiKeyRow.activatable_widget = openaiApiKey;


    const ShortcutToggleOverlayRow = new Adw.ActionRow({title: 'shortcut-toggle-overlay'});
    group.add(ShortcutToggleOverlayRow);

    const ShortcutToggleOverlay = new Gtk.Entry({
        hexpand: true
    });

    // Retrieve the array of strings
    const shortcuts = settings.get_strv("shortcut-toggle-overlay");

    // only the first shortcut in the entry:
    ShortcutToggleOverlay.text = shortcuts[0] || '';

    // show all shortcuts joined by commas:
    //ShortcutToggleOverlay.text = shortcuts.join(', ');

    // Bind the setting back to the entry (the value stays an array)
    // When the user edits the entry → update the GSettings array
    ShortcutToggleOverlay.connect('changed', () => {
        // Split the comma‑separated text, trim spaces, drop empties
        const arr = ShortcutToggleOverlay.text.split(',')
                                                .map(s => s.trim())
                                                .filter(Boolean);
        settings.set_strv('shortcut-toggle-overlay', arr);
    });

    // When the GSettings value changes (e.g., from another source)
    // update the entry so the UI stays in sync
    settings.connect('changed::shortcut-toggle-overlay', () => {
        const arr = settings.get_strv('shortcut-toggle-overlay');
        const newText = arr.join(', ');
        // Avoid an infinite loop: only update if the text is really different
        if (ShortcutToggleOverlay.text !== newText) {
            ShortcutToggleOverlay.text = newText;
        }
    });

    // Add the widget to the UI
    ShortcutToggleOverlayRow.add_suffix(ShortcutToggleOverlay);
    ShortcutToggleOverlayRow.activatable_widget = ShortcutToggleOverlay;


    const systemPromptRow = new Adw.ActionRow({title: 'System Prompt (optional)'});
    group.add(systemPromptRow);

    const systemPrompt = new Gtk.Entry({
        hexpand: true
    });

    systemPrompt.text = settings.get_string("system-prompt");

    settings.bind("system-prompt", systemPrompt, 'text', Gio.SettingsBindFlags.DEFAULT);

    systemPromptRow.add_suffix(systemPrompt);
    systemPromptRow.activatable_widget = systemPrompt;


    const debugModeRow = new Adw.ActionRow({title: 'Debug Mode'});
    group.add(debugModeRow);

    const debugModeToggle = new Gtk.Switch({
        active: settings.get_boolean('debug-mode'),
        valign: Gtk.Align.CENTER,
    });
    settings.bind('debug-mode', debugModeToggle, 'active', Gio.SettingsBindFlags.DEFAULT);

    // Add the switch to the row
    debugModeRow.add_suffix(debugModeToggle);
    debugModeRow.activatable_widget = debugModeToggle;


    // Add our page to the window
    window.add(page);
}
