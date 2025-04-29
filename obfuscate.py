import os
import subprocess
import shutil
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler("transform_js_files.log"), logging.StreamHandler()],
)

def check_dependencies():
    """Check if required tools are available."""
    dependencies = ["npx", "uglifyjs", "babel", "javascript-obfuscator"]
    for dep in dependencies:
        if not shutil.which(dep):
            logging.error(f"Dependency missing: {dep}. Please install it before proceeding.")
            raise EnvironmentError(f"{dep} is not installed or not in PATH.")

def transform_js_files(directory="."):
    if not os.path.exists(directory):
        logging.error(f"Directory does not exist: {directory}")
        return

    for root, dirs, files in os.walk(directory):
        # Exclude unwanted directories like node_modules
        dirs[:] = [d for d in dirs if d not in ("node_modules",)]

        for file in files:
            if file.endswith(".js") and not file.endswith(".obfuscated.js"):
                # Construct relative file paths
                original_file = os.path.join(root, file)
                base_name = os.path.splitext(file)[0]

                minified_file = os.path.join(root, f"{base_name}.min.js")
                transpiled_file = os.path.join(root, f"{base_name}.transpiled.js")
                obfuscated_file = os.path.join(root, f"{base_name}.obfuscated.js")

                try:
                    logging.info(f"Processing file: {original_file}")

                    # Step 1: Minify with UglifyJS
                    logging.debug(f"Minifying: {original_file}")
                    subprocess.run(
                        ["npx", "uglifyjs", original_file, "--compress", "--mangle", "--output", minified_file],
                        check=True,
                        stderr=subprocess.PIPE,
                        stdout=subprocess.PIPE,
                    )

                    # Step 2: Transpile with Babel
                    logging.debug(f"Transpiling: {minified_file}")
                    subprocess.run(
                        ["npx", "babel", minified_file, "--out-file", transpiled_file, "--config-file", "./.babelrc"],
                        check=True,
                        stderr=subprocess.PIPE,
                        stdout=subprocess.PIPE,
                    )

                    # Step 3: Obfuscate with JavaScript Obfuscator
                    logging.debug(f"Obfuscating: {transpiled_file}")
                    subprocess.run(
                        ["npx", "javascript-obfuscator", transpiled_file, "--output", obfuscated_file, "--options-preset", "high-obfuscation"],
                        check=True,
                        stderr=subprocess.PIPE,
                        stdout=subprocess.PIPE,
                    )

                    # Cleanup
                    logging.debug(f"Cleaning up temporary files for: {file}")
                    os.remove(original_file)
                    os.remove(minified_file)
                    os.remove(transpiled_file)

                    # Rename obfuscated file to replace original
                    os.rename(obfuscated_file, original_file)
                    logging.info(f"Replaced {original_file} with obfuscated version.")

                except subprocess.CalledProcessError as e:
                    logging.error(
                        f"Command failed for {file}. "
                        f"Command: {e.cmd} "
                        f"Return code: {e.returncode} "
                        f"Error output: {e.stderr.decode() if e.stderr else 'No stderr output'}"
                    )
                except FileNotFoundError as e:
                    logging.error(f"File not found: {e}")
                except Exception as e:
                    logging.error(f"Unexpected error for {file}: {e}")

if __name__ == "__main__":
    working_directory = "./"
    logging.info(f"Starting JavaScript transformation in: {working_directory}")

    try:
        check_dependencies()
        transform_js_files(working_directory)
    except EnvironmentError as e:
        logging.critical(f"Environment validation failed: {e}")
    except Exception as e:
        logging.critical(f"Unexpected failure: {e}")
